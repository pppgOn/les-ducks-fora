import uuid

from fastapi import Depends
from sqlalchemy import UUID, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from nuitinfo.db.dependencies import get_db_session
from nuitinfo.db.models.quizz import QuizzLevel, QuizzPoints


class QuizzDAO:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_user_previous_score(
        self,
        user_id: UUID[uuid.UUID],
        level: int,
    ) -> int:
        """
        Get the previous score of a user for a level
        It will use User table and quizzlevel table
        """
        previous_score = await self.session.execute(
            select(QuizzPoints)
            .where(QuizzPoints.id == user_id)  # type: ignore
            .where(QuizzPoints.level == level),  # type: ignore
        )
        score = previous_score.scalar_one_or_none()
        return score.points if score else 0

    async def create_a_score_for_user_and_level(
        self,
        user_id: UUID[uuid.UUID],
        level: int,
        score: int,
    ) -> None:
        """
        Add to a user a score for a level
        It will use User table and quizzlevel table
        """
        self.session.add(QuizzPoints(id=user_id, level=level, points=score))

    async def update_a_score_for_user_and_level(
        self,
        user_id: UUID[uuid.UUID],
        level: int,
        score: int,
    ) -> int:
        """
        Update a score for a user and a level
        It will use User table and quizzlevel table
        """
        level_defined = await self.session.execute(
            select(QuizzLevel).where(QuizzLevel.level == level),  # type: ignore
        )
        if level_defined.scalar_one_or_none() is None:
            return -1
        previous_score = await self.session.execute(
            select(QuizzPoints)
            .where(QuizzPoints.id == user_id)  # type: ignore
            .where(
                QuizzPoints.level == level,  # type: ignore
            ),
        )
        points_nb = previous_score.scalar_one_or_none()
        if points_nb is None:
            await self.create_a_score_for_user_and_level(user_id, level, score)
            return score
        if score <= points_nb.points:
            return points_nb.points
        await self.session.execute(
            update(QuizzPoints).where(QuizzPoints.id == user_id).where(QuizzPoints.level == level).values({QuizzPoints.points: score}).execution_options(synchronize_session="fetch"),  # type: ignore
        )
        return score

    async def add_level(self, level: int, name: str) -> bool:
        """
        Add a level to the quizz
        It will use quizzlevel table
        """
        level_defined = await self.session.execute(
            select(QuizzLevel).where(QuizzLevel.level == level),  # type: ignore
        )
        if level_defined.scalar_one_or_none() is not None:
            return False
        self.session.add(QuizzLevel(level=level, name=name))
        return True
