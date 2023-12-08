import uuid
from typing import TYPE_CHECKING

from sqlalchemy import UUID, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from nuitinfo.db.base import Base


class QuizzLevel(Base):
    """
    Model for QuizzLevel
    """

    __tablename__ = "quizzlevel"

    if TYPE_CHECKING:  # pragma: no cover
        level: int
        name: str
    else:
        level: Mapped[int] = mapped_column(Integer, primary_key=True)
        name: Mapped[str] = mapped_column(String(length=200))


class QuizzPoints(Base):
    """
    QuizzPoints protocol that ORM model should follow.
    """

    __tablename__ = "quizzpoints"

    if TYPE_CHECKING:  # pragma: no cover
        id: uuid.UUID
        points: int
        level: int
    else:
        # Make a link between a user and a specific level, it will have a column for points
        id: Mapped[uuid.UUID] = mapped_column(
            UUID,
            ForeignKey("user.id", ondelete="cascade"),
            primary_key=True,
        )
        points: Mapped[int] = mapped_column(Integer, nullable=False)
        level: Mapped[int] = mapped_column(
            Integer,
            ForeignKey("quizzlevel.level", ondelete="cascade"),
            primary_key=True,
        )
