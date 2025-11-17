from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv  # for environment variables
import os

# Load environment variables from .env file if available
load_dotenv()

# Read config from environment or fallback to defaults
DB_USERNAME = os.getenv("DB_USERNAME", "app_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "sarveshdeepika")  # replace or keep
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "employee_task_db")

SQLALCHEMY_DATABASE_URL = (
    f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Create database engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Make DB session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
Base = declarative_base()