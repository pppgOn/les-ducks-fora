import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ARRAY, UUID, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from nuitinfo.db.base import Base


class Inventory(Base):
    """
    QuizzPoints protocol that ORM model should follow.
    """

    __tablename__ = "inventory"

    if TYPE_CHECKING:  # pragma: no cover
        id: uuid.UUID
        inventory: list[int]
    else:
        # Make a link between a user and a specific level, it will have a column for points
        id: Mapped[uuid.UUID] = mapped_column(
            UUID,
            ForeignKey("user.id", ondelete="cascade"),
            primary_key=True,
        )
        inventory: Mapped[list[int]] = mapped_column(
            ARRAY(Integer),
            default=[],
            nullable=False,
        )
