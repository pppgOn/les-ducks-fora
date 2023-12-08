# type: ignore
import uuid

from fastapi import Depends
from fastapi_users import BaseUserManager, UUIDIDMixin, schemas
from fastapi_users.db import (
    SQLAlchemyBaseOAuthAccountTableUUID,
    SQLAlchemyBaseUserTableUUID,
    SQLAlchemyUserDatabase,
)
from httpx_oauth.clients.google import GoogleOAuth2
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, relationship

from nuitinfo.db.base import Base
from nuitinfo.db.dependencies import get_db_session
from nuitinfo.jwt_refresh_token.BearerRefreshTokenTransport import (
    BearerRefreshTokenTransport,
)
from nuitinfo.jwt_refresh_token.FastAPIUsersRefreshToken import FastAPIUsersRefreshToken
from nuitinfo.jwt_refresh_token.JWTRefreshStrategy import (
    JWTRefreshStrategy,
    SQLAlchemyBaseJWTRefreshTokenTableUUID,
)
from nuitinfo.jwt_refresh_token.JWTRefreshTokenBackend import JWTRefreshTokenBackend
from nuitinfo.settings import settings


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    """Represents an OAuth account."""


class User(SQLAlchemyBaseUserTableUUID, Base):
    """Represents a user entity."""

    oauth_accounts: Mapped[OAuthAccount] = relationship("OAuthAccount", lazy="joined")


class RefreshTokenCode(SQLAlchemyBaseJWTRefreshTokenTableUUID, Base):
    """Register token for refresh token"""


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Represents a read command for a user."""


class UserCreate(schemas.BaseUserCreate):
    """Represents a create command for a user."""


class UserUpdate(schemas.BaseUserUpdate):
    """Represents an update command for a user."""


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    """Manages a user session and its tokens."""

    reset_password_token_secret = settings.users_secret
    verification_token_secret = settings.users_secret


async def get_user_db(
    session: AsyncSession = Depends(get_db_session),
) -> SQLAlchemyUserDatabase:
    """
    Yield a SQLAlchemyUserDatabase instance.

    :param session: asynchronous SQLAlchemy session.
    :yields: instance of SQLAlchemyUserDatabase.
    """
    yield SQLAlchemyUserDatabase(session, User, OAuthAccount)


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> UserManager:
    """
    Yield a UserManager instance.

    :param user_db: SQLAlchemy user db instance
    :yields: an instance of UserManager.
    """
    yield UserManager(user_db)


def get_jwt_refresh_strategy(
    session: AsyncSession = Depends(get_db_session),
) -> JWTRefreshStrategy:
    """
    Return a JWTStrategy in order to instantiate it dynamically.

    :returns: instance of JWTStrategy with provided settings.
    """
    return JWTRefreshStrategy(
        session=session,
        refresh_token_table=RefreshTokenCode,
        secret=settings.users_secret,
        lifetime_seconds=1800,
        refresh_lifetime_seconds=3600,
    )


bearer_transport = BearerRefreshTokenTransport(tokenUrl="auth/jwt/login")
auth_jwt = JWTRefreshTokenBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_refresh_strategy,
)

google_oauth_client = GoogleOAuth2(
    settings.google_client_id,
    settings.google_client_secret,
)

backends = [
    auth_jwt,
]

api_users = FastAPIUsersRefreshToken[User, uuid.UUID](get_user_manager, backends)

current_active_user = api_users.current_user(active=True)
