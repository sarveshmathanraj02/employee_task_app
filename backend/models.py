from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

# ===== User Model (Authentication) =====

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    # Optional: if you want to link users to tasks they created later
    # tasks = relationship("Task", back_populates="creator")


# ===== Employee Model =====

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks = relationship(
        "Task",
        back_populates="employee",
        cascade="all, delete-orphan"
    )


# ===== Task Model =====

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="pending")
    due_date = Column(Date)

    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    employee = relationship("Employee", back_populates="tasks")

    # Optional: add this if you want to track who created the task (user link)
    # creator_id = Column(Integer, ForeignKey("users.id"))
    # creator = relationship("User", backref="created_tasks")