"""Add points table

Revision ID: fbbeeac031c8
Revises: f2136eea2668
Create Date: 2023-12-08 00:01:05.441202

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "fbbeeac031c8"
down_revision = "f2136eea2668"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "quizzlevel",
        sa.Column("level", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint("level"),
    )
    op.create_table(
        "quizzpoints",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("points", sa.Integer(), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["id"], ["user.id"], ondelete="cascade"),
        sa.ForeignKeyConstraint(["level"], ["quizzlevel.level"], ondelete="cascade"),
        sa.PrimaryKeyConstraint("id", "level"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("quizzpoints")
    op.drop_table("quizzlevel")
    # ### end Alembic commands ###
