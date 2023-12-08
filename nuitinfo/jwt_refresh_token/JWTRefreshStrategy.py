import typing
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Dict, Generic, List, Optional, Type

import jwt
from fastapi_users import exceptions, models
from fastapi_users.authentication.strategy import AP, StrategyDestroyNotSupportedError
from fastapi_users.authentication.strategy.base import StrategyDestroyNotSupportedError
from fastapi_users.jwt import SecretType, decode_jwt, generate_jwt
from fastapi_users.manager import BaseUserManager
from fastapi_users.models import ID
from fastapi_users_db_sqlalchemy.generics import GUID, TIMESTAMPAware, now_utc
from loguru import logger
from sqlalchemy import ForeignKey, String, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from nuitinfo.jwt_refresh_token.StrategyRefreshToken import StrategyRefreshToken


class RefreshTokenInvalid(Generic[models.ID], Exception):
    """Raised when the refresh token is invalid."""

    user_id: Optional[models.ID] = None

    def __init__(self, user_id: Optional[models.ID] = None) -> None:
        self.user_id = user_id
        super().__init__()


class SQLAlchemyBaseJWTRefreshTokenTable(Generic[ID]):
    """Base SQLAlchemy access token table definition."""

    __tablename__ = "refreshtoken"

    if TYPE_CHECKING:  # pragma: no cover
        token: str
        created_at: datetime
        user_id: ID
    else:
        token: Mapped[str] = mapped_column(String(length=43), nullable=False)
        created_at: Mapped[datetime] = mapped_column(
            TIMESTAMPAware(timezone=True),
            index=True,
            nullable=False,
            default=now_utc,
        )


class SQLAlchemyBaseJWTRefreshTokenTableUUID(
    SQLAlchemyBaseJWTRefreshTokenTable[uuid.UUID],
):
    if TYPE_CHECKING:  # pragma: no cover
        user_id: uuid.UUID
    else:
        user_id: Mapped[uuid.UUID] = mapped_column(
            GUID,
            ForeignKey("user.id", ondelete="cascade"),
            primary_key=True,
        )


class JWTRefreshStrategy(
    Generic[AP, models.UP, models.ID],
    StrategyRefreshToken[models.UP, models.ID],
):
    def __init__(
        self,
        session: AsyncSession,
        refresh_token_table: Type[AP],
        secret: SecretType,
        lifetime_seconds: Optional[int],
        refresh_lifetime_seconds: Optional[int],
        token_audience: List[str] = ["fastapi-users:auth"],
        algorithm: str = "HS256",
        public_key: Optional[SecretType] = None,
    ):
        self.session = session
        self.refresh_token_table = refresh_token_table
        self.secret = secret
        self.lifetime_seconds = lifetime_seconds
        self.refresh_lifetime_seconds = refresh_lifetime_seconds
        self.token_audience = token_audience
        self.algorithm = algorithm
        self.public_key = public_key

    @property
    def encode_key(self) -> SecretType:
        return self.secret

    @property
    def decode_key(self) -> SecretType:
        return self.public_key or self.secret

    async def read_token(
        self,
        token: Optional[str],
        user_manager: BaseUserManager[models.UP, models.ID],
    ) -> Optional[models.UP]:
        if token is None:
            return None

        try:
            data = decode_jwt(
                token,
                self.decode_key,
                self.token_audience,
                algorithms=[self.algorithm],
            )
            user_id = data.get("sub")
            expire = data.get("exp")
            if user_id is None:
                return None
        except jwt.PyJWTError:
            return None

        try:
            parsed_id = user_manager.parse_id(user_id)
            if self.lifetime_seconds is not None:
                if expire is None or datetime.utcnow() > datetime.fromtimestamp(expire):
                    raise RefreshTokenInvalid(user_id=user_id)
            return await user_manager.get(parsed_id)
        except (exceptions.UserNotExists, exceptions.InvalidID):
            return None

    async def write_token(self, user: models.UP) -> str:
        return await self._write_token(user.id)

    async def _write_token(self, user_id: ID) -> str:
        data = {"sub": str(user_id), "aud": self.token_audience}
        refresh_key = uuid.uuid4().hex
        refresh_data = {
            "sub": str(user_id),
            "aud": self.token_audience,
            "val": refresh_key,
        }
        result: Optional[AP] = await self._get_by_user_id(user_id)
        if not result:
            await self._create_refresh_token({"token": refresh_key, "user_id": user_id})
        else:
            await self._update_refresh_token(result, {"token": refresh_key})
        return (
            generate_jwt(
                data,
                self.encode_key,
                self.lifetime_seconds,
                algorithm=self.algorithm,
            )
            + "@"
            + generate_jwt(
                refresh_data,
                self.encode_key,
                self.refresh_lifetime_seconds,
                algorithm=self.algorithm,
            )
        )

    async def destroy_token(self, token: str, user: models.UP) -> None:

        await self._delete_refresh_token(user.id)
        raise StrategyDestroyNotSupportedError(
            "A JWT can't be invalidated: it's valid until it expires.",
        )

    async def refresh_token(
        self,
        refresh_token: str,
    ) -> Optional[str]:
        try:
            return await self._refresh_token(refresh_token)
        except RefreshTokenInvalid as e:
            if e.user_id is not None:
                await self._delete_refresh_token(e.user_id)
            return None

    async def _refresh_token(self, refresh_token: str) -> str:
        try:
            data = decode_jwt(
                refresh_token,
                self.decode_key,
                self.token_audience,
                algorithms=[self.algorithm],
            )
            logger.info(data)
            user_id = data.get("sub")
            token_key = data.get("val")
            expire = data.get("exp")
            if user_id is None:
                raise RefreshTokenInvalid()
        except jwt.PyJWTError:
            raise RefreshTokenInvalid()

        user: Optional[AP] = await self._get_by_user_id(user_id)
        if user is None:
            raise RefreshTokenInvalid()

        if token_key != user.token:
            raise RefreshTokenInvalid(user_id=user_id)

        if self.refresh_lifetime_seconds is not None:
            if expire is None or datetime.utcnow() > datetime.fromtimestamp(expire):
                raise RefreshTokenInvalid(user_id=user_id)

        return await self._write_token(user.user_id)

    async def _create_refresh_token(
        self,
        create_dict: Dict[str, typing.Any],
    ) -> Optional[AP]:
        refresh_token = self.refresh_token_table(**create_dict)
        self.session.add(refresh_token)
        await self.session.commit()
        await self.session.refresh(refresh_token)
        return refresh_token

    async def _get_by_user_id(self, user_id: ID) -> Optional[AP]:
        statement = select(self.refresh_token_table).where(
            self.refresh_token_table.user_id == user_id,  # type: ignore
        )
        results = await self.session.execute(statement)
        return results.scalar_one_or_none()

    async def _update_refresh_token(
        self,
        refresh_token: AP,
        update_dict: Dict[str, typing.Any],
    ) -> AP:
        for key, value in update_dict.items():
            setattr(refresh_token, key, value)
        self.session.add(refresh_token)
        await self.session.commit()
        await self.session.refresh(refresh_token)
        return refresh_token

    async def _delete_refresh_token(self, user_id: ID) -> None:
        await self.session.delete(user_id)
        await self.session.commit()
