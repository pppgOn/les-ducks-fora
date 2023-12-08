import uuid

from fastapi import Depends
from sqlalchemy import UUID, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from nuitinfo.db.dependencies import get_db_session
from nuitinfo.db.models.inventory import Inventory


class InventoryDAO:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_inventory(self, user_id: UUID[uuid.UUID]) -> list[int]:
        """
        Get the inventory of a user
        It will use User table and inventory table
        """
        inventory = await self.session.execute(
            select(Inventory).where(Inventory.id == user_id),  # type: ignore
        )
        inventory_2 = inventory.scalar_one_or_none()
        return inventory_2.inventory if inventory_2 else 0  # type: ignore

    async def add_to_inventory(self, user_id: UUID[uuid.UUID], boule_id: int) -> None:
        """
        Add a boule to the inventory of a user
        It will use User table and inventory table
        """
        inventory = await self.session.execute(
            select(Inventory).where(Inventory.id == user_id),  # type: ignore
        )
        inventory_2 = inventory.scalar_one_or_none()
        if inventory_2:
            if boule_id in inventory_2.inventory:
                return
            inventory_2.inventory.append(boule_id)
            await self.session.execute(
                update(Inventory)
                .where(Inventory.id == user_id)  # type: ignore
                .values(
                    inventory=inventory_2.inventory,
                )
                .execution_options(synchronize_session="fetch"),
            )
        else:
            self.session.add(Inventory(id=user_id, inventory=[boule_id]))
