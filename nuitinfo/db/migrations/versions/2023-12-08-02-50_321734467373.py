"""Create special inventory table and remove in user

Revision ID: 321734467373
Revises: d15278226248
Create Date: 2023-12-08 02:50:19.332550

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "321734467373"
down_revision = "d15278226248"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "inventory",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("inventory", sa.ARRAY(sa.Integer()), nullable=False),
        sa.ForeignKeyConstraint(["id"], ["user.id"], ondelete="cascade"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.drop_column("user", "inventory")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "user",
        sa.Column(
            "inventory",
            postgresql.ARRAY(sa.INTEGER()),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.drop_table("inventory")
    # ### end Alembic commands ###