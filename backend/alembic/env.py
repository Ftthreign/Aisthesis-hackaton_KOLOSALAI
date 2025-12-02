from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy.engine import Connection
from sqlalchemy.pool import NullPool

from alembic import context

# Tambahkan path project
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.config import settings
from app.database import Base
import app.models


print("=== DEBUG METADATA TABLES ===")
print(Base.metadata.tables.keys())
print("=============================")


# Alembic config
config = context.config

# Gunakan URL sync (psycopg2)
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL_SYNC)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata untuk autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Jalankan migration tanpa DB connection (offline mode)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Jalankan migration dengan engine sync (online mode)."""
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL_SYNC

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# Mode detection
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
