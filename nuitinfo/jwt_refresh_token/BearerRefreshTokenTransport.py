from fastapi import Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi_users.authentication.transport.base import TransportLogoutNotSupportedError
from fastapi_users.openapi import OpenAPIResponseType
from fastapi_users.schemas import model_dump
from pydantic import BaseModel

from nuitinfo.jwt_refresh_token.TransportRefreshToken import TransportRefreshToken


class BearerRefreshTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class BearerRefreshTokenTransport(TransportRefreshToken):
    scheme: OAuth2PasswordBearer

    def __init__(self, tokenUrl: str):
        self.scheme = OAuth2PasswordBearer(tokenUrl, auto_error=False)

    async def get_login_response_jwt(self, token: str, refresh_token: str) -> Response:
        bearer_response = BearerRefreshTokenResponse(
            access_token=token,
            refresh_token=refresh_token,
            token_type="bearer",
        )
        return JSONResponse(model_dump(bearer_response))

    async def get_logout_response(self) -> Response:
        raise TransportLogoutNotSupportedError()

    @staticmethod
    def get_openapi_login_responses_success() -> OpenAPIResponseType:
        return {
            status.HTTP_200_OK: {
                "model": BearerRefreshTokenResponse,
                "content": {
                    "application/json": {
                        "example": {
                            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNzIzY2VkZC1iZTE0LTQ5ZDItOTNjMy0yYTI5NzdhYzljM2EiLCJhdWQiOlsiZmFzdGFwaS11c2VyczphdXRoIl0sImV4cCI6MTcwMTg5NTU1M30.xVCKEncZALZkLcyMEI0RH_0dS4jo6vvnpp0WQTIJIEg",
                            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNzIzY2VkZC1iZTE0LTQ5ZDItOTNjMy0yYTI5NzdhYzljM2EiLCJhdWQiOlsiZmFzdGFwaS11c2VyczphdXRoIl0sInZhbCI6IjdjNTU5MmM5NjQ1OTRjMTM5MjljZDNhZjc1Y2I2ZmMzIiwiZXhwIjoxNzAxODk3MzUzfQ.E-zvrOfWSsAVLTQ4WNgWLkjCt2IafA7s-wZfuLSlMJo",
                            "token_type": "bearer",
                        },
                    },
                },
            },
        }

    @staticmethod
    def get_openapi_logout_responses_success() -> OpenAPIResponseType:
        return {}
