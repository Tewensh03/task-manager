from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class TaskStatus(str, Enum):
    active = "active"
    completed = "completed"

# Task Requests
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    

# Task Response
class Task(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    created_at: datetime
    updated_at: datetime


class PaginatedTaskResponse(BaseModel):
    tasks: list[Task]
    total: int
    page: int
    page_size: int
    total_pages: int