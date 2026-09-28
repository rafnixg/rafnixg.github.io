"""Add editable pages, redirects and media metadata."""

from alembic import op
import sqlalchemy as sa

revision = "0003_pages_media"
down_revision = "0002_resume_document"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "pages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(160), nullable=False, unique=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("body_html", sa.Text(), nullable=False),
        sa.Column("meta_title", sa.String(200), nullable=False),
        sa.Column("meta_description", sa.String(500), nullable=False),
        sa.Column("og_image", sa.String(1000), nullable=False),
        sa.Column("visible", sa.Boolean(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "page_redirects",
        sa.Column("old_slug", sa.String(160), primary_key=True),
        sa.Column("page_id", sa.Integer(), nullable=False),
    )
    op.create_table(
        "media",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("filename", sa.String(180), nullable=False, unique=True),
        sa.Column("original_name", sa.String(250), nullable=False),
        sa.Column("mime_type", sa.String(80), nullable=False),
        sa.Column("size", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade():
    op.drop_table("media")
    op.drop_table("page_redirects")
    op.drop_table("pages")
