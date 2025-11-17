# backend/schemas.py
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, EmailStr

# USER SCHEMAS
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# EMPLOYEE SCHEMAS
class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Update schema: all fields optional (for PATCH/PUT usage)
class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None

    class Config:
        orm_mode = True

# TASK SCHEMAS
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"
    due_date: Optional[date] = None
    employee_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int

    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None
    employee_id: Optional[int] = None

    class Config:
        orm_mode = True
