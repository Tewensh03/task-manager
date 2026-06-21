import math
from typing import Optional
from fastapi import HTTPException
from .repository import TaskRepository
from .models import PaginatedTaskResponse, TaskCreate, TaskUpdate

STATUS_KEYWORDS: dict[str, str] = {
    "active": "active",
    "incomplete": "active",
    "inactive": "completed",
    "completed": "completed",
}

class TaskService:
    def __init__(self):
        self.repo = TaskRepository()


    def create_task(self, payload: TaskCreate) -> dict:
        return self.repo.create(payload.title, payload.description)
    

    def list_tasks(
            self,
            search: Optional[str],
            status: Optional[str],
            page: int,
            page_size: int
    ) -> PaginatedTaskResponse:
        if status and status not in ("all", "active", "completed"):
            raise HTTPException(status_code=400, detail="Invalid status filter.")
 
        resolved_search = search
        resolved_status = status
 
        # If the user searches for a status keyword (e.g., 'active', 'completed'),
        # map it to the proper status filter and clear the search query string
        # so the database looks for the status rather than matching the literal text.
        if search and search.strip().lower() in STATUS_KEYWORDS:
            resolved_status = STATUS_KEYWORDS[search.strip().lower()]
            resolved_search = None
 
        tasks, total = self.repo.get_all(
            search=resolved_search,
            status=resolved_status,
            page=page,
            page_size=page_size,
        )
 
        return PaginatedTaskResponse(
            tasks=tasks,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=max(1, math.ceil(total / page_size)),
        )
    

    def get_task(self, task_id: int) -> dict:
        task = self.repo.get_by_id(task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found.")
        
        return task
    

    def update_task(self, task_id: int, payload: TaskUpdate) -> dict:
        self.get_task(task_id)
        fields = payload.model_dump(exclude_unset=True)
        
        if not fields:
            raise HTTPException(status_code=400, detail="No fields to update.")
        
        return self.repo.update(task_id, fields)
    

    def toggle_status(self, task_id: int) -> dict:
        task = self.get_task(task_id)
        new_status = "completed" if task["status"] == "active" else "active"

        return self.repo.update(task_id, {"status": new_status})


    def delete_task(self, task_id: int) -> dict:
        self.get_task(task_id)
        self.repo.delete(task_id)

        return {"message": f"task {task_id} deleted successfully."}