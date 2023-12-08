from typing import Optional

from fastapi_users import models
from fastapi_users.authentication import Strategy


class StrategyDestroyNotSupportedError(Exception):
    pass


class StrategyRefreshToken(Strategy[models.UP, models.ID]):
    """Specialized Strategy for Refresh Token"""

    async def refresh_token(self, refresh_token: str) -> Optional[str]:
        """Refresh the token if it is valid"""
