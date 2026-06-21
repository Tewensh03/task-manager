from fastapi import APIRouter, Query
from typing import Optional
from .service import TaskService
from .models import PaginatedTaskResponse, Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])
service = TaskService()

@router.post("/", response_model=Task, status_code=201)
def create_task(payload: TaskCreate):
    new_task = service.create_task(payload)
    return new_task


@router.get("/", response_model=PaginatedTaskResponse)
def list_tasks(
    # Query params with default data
    search: Optional[str] = Query(None, description="Search by title"), 
    status: Optional[str] = Query("all", description="Filter: all | active | completed"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page")
):
    tasks = service.list_tasks(
        search=search, 
        status=status, 
        page=page, 
        page_size=page_size
    )

    return tasks


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int):
    task = service.get_task(task_id)
    return task


@router.patch("/{task_id}", response_model=Task)
def update_task(task_id: int, payload: TaskUpdate):
    updated_task = service.update_task(task_id, payload)
    return updated_task


@router.patch("/{task_id}/toggle", response_model=Task)
def toggle_status(task_id: int):
    return service.toggle_status(task_id)


@router.delete("/{task_id}")
def delete_task(task_id: int):
    return service.delete_task(task_id)