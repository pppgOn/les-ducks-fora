from fastapi import APIRouter, Depends, Request
from fastapi_users import models
from fastapi_users.authentication import Authenticator
from fastapi_users.manager import UserManagerDependency
from fastapi_users.router.auth import get_auth_router as fastapi_users_auth_router
from starlette.responses import Response

from nuitinfo.jwt_refresh_token.JWTRefreshTokenBackend import JWTRefreshTokenBackend
from nuitinfo.jwt_refresh_token.StrategyRefreshToken import StrategyRefreshToken


def get_auth_router_jwt(
    backend: JWTRefreshTokenBackend[models.UP, models.ID],
    get_user_manager: UserManagerDependency[models.UP, models.ID],
    authenticator: Authenticator,
    requires_verification: bool = False,
) -> APIRouter:
    router: APIRouter = fastapi_users_auth_router(
        backend,
        get_user_manager,
        authenticator,
        requires_verification,
    )

    get_current_user_token = authenticator.current_user_token(
        active=True,
        verified=requires_verification,
    )

    @router.post(
        "/refresh",
        name=f"auth:{backend.name}.refresh",
        summary="Refresh JWT token.",
        response_description="JWT token",
    )
    async def refresh_jwt_token(
        request: Request,
        refresh_token: str,
        strategy: StrategyRefreshToken[models.UP, models.ID] = Depends(
            backend.get_strategy,
        ),
    ) -> Response:
        return await backend.refresh(strategy, refresh_token)

    return router
