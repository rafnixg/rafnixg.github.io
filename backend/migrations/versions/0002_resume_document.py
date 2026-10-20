"""Store the editable JSON Resume document."""

from alembic import op
import sqlalchemy as sa

revision = "0002_resume_document"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "resume_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("document", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade():
    op.drop_table("resume_documents")
