from fastapi import status
from fastapi_users import models
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import (
    Strategy,
    StrategyDestroyNotSupportedError,
)
from fastapi_users.authentication.transport import TransportLogoutNotSupportedError
from fastapi_users.types import DependencyCallable
from starlette.responses import Response

from nuitinfo.jwt_refresh_token.StrategyRefreshToken import StrategyRefreshToken
from nuitinfo.jwt_refresh_token.TransportRefreshToken import TransportRefreshToken


class JWTRefreshTokenBackend(AuthenticationBackend[models.UP, models.ID]):
    """
    Combination of an authentication transport and strategy.

    Together, they provide a full authentication method logic.

    :param name: Name of the backend.
    :param transport: Authentication transport instance.
    :param get_strategy: Dependency callable returning
    an authentication strategy instance.
    """

    name: str
    transport_jwt: TransportRefreshToken

    def __init__(
        self,
        name: str,
        transport: TransportRefreshToken,
        get_strategy: DependencyCallable[StrategyRefreshToken[models.UP, models.ID]],
    ):
        super().__init__(name, transport, get_strategy)
        self.name = name
        self.transport_jwt = transport
        self.get_strategy = get_strategy

    async def login(
        self,
        strategy: Strategy[models.UP, models.ID],
        user: models.UP,
    ) -> Response:
        result = (await strategy.write_token(user)).split("@")
        token, refresh_token = result[0], result[1]
        return await self.transport_jwt.get_login_response_jwt(token, refresh_token)

    async def logout(
        self,
        strategy: Strategy[models.UP, models.ID],
        user: models.UP,
        token: str,
    ) -> Response:
        try:
            await strategy.destroy_token(token, user)
        except StrategyDestroyNotSupportedError:
            pass

        try:
            response = await self.transport_jwt.get_logout_response()
        except TransportLogoutNotSupportedError:
            response = Response(status_code=status.HTTP_204_NO_CONTENT)

        return response

    async def refresh(
        self,
        strategy: StrategyRefreshToken[models.UP, models.ID],
        refresh_token: str,
    ) -> Response:
        result = await strategy.refresh_token(refresh_token)
        if result is None:
            return Response(status_code=status.HTTP_401_UNAUTHORIZED)
        result_list = result.split("@")
        token, refresh_token = result_list[0], result_list[1]
        return await self.transport_jwt.get_login_response_jwt(token, refresh_token)
