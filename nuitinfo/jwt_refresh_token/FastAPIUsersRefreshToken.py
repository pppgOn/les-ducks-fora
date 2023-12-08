from typing import Sequence, Type

from fastapi import APIRouter
from fastapi_users import FastAPIUsers, models
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.manager import UserManagerDependency

from nuitinfo.jwt_refresh_token.jwtAuth import get_auth_router_jwt
from nuitinfo.jwt_refresh_token.JWTRefreshTokenBackend import JWTRefreshTokenBackend

try:
    from httpx_oauth.oauth2 import BaseOAuth2

except ModuleNotFoundError:  # pragma: no cover
    BaseOAuth2 = Type  # type: ignore


class FastAPIUsersRefreshToken(FastAPIUsers[models.UP, models.ID]):
    """
    Main object that ties together the component for users authentication.

    :param get_user_manager: Dependency callable getter to inject the
    user manager class instance.
    :param auth_backends: List of authentication backends.

    :attribute current_user: Dependency callable getter to inject authenticated user
    with a specific set of parameters.
    """

    def __init__(
        self,
        get_user_manager: UserManagerDependency[models.UP, models.ID],
        auth_backends: Sequence[JWTRefreshTokenBackend[models.UP, models.ID]],
    ):
        super().__init__(get_user_manager, auth_backends)

    def get_auth_router(
        self,
        backend: AuthenticationBackend[models.UP, models.ID],
        requires_verification: bool = False,
    ) -> APIRouter:
        """
        Return an auth router for a given authentication backend.

        :param backend: The authentication backend instance.
        :param requires_verification: Whether the authentication
        require the user to be verified or not. Defaults to False.
        """
        if not isinstance(backend, JWTRefreshTokenBackend):
            raise TypeError(
                "Only JWTRefreshTokenBackend is supported for get_auth_router_jwt",
            )
        return get_auth_router_jwt(
            backend,
            self.get_user_manager,
            self.authenticator,
            requires_verification,
        )
