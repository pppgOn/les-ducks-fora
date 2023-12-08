from typing import Protocol

from fastapi import Response
from fastapi_users.authentication import Transport
from fastapi_users.openapi import OpenAPIResponseType


class TransportRefreshToken(Transport, Protocol):
    async def get_login_response_jwt(
        self,
        token: str,
        refresh_token: str,
    ) -> Response:  # pragma: no cover
        """Return a response to send when the user successfully logs in."""
        ...  # pragma: no cover

    @staticmethod
    def get_openapi_login_responses_jwt_success() -> OpenAPIResponseType:
        """Return a dictionary to use for the openapi responses route parameter."""
        ...  # pragma: no cover
