from typing import Optional
from app.database import get_db

class TaskRepository:

    def create(self, title: str, description: Optional[str]) -> dict:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                        INSERT INTO tasks (title, description, status)
                        VALUES (%s, %s, 'active')
                        RETURNING *
                    """,
                    (title, description)
                )
                return cur.fetchone()


    def get_all(
            self, 
            search: Optional[str] = None,
            status: Optional[str] = None,
            page: int = 1,
            page_size: int = 10
    ) -> tuple[list[dict]]:
        # How many rows to skip depending on page
        # e.g (2 - 1) x 10 = 10 rows
        offset = (page - 1) * page_size 

        # Just a filler to avoid SQL syntax errors 
        # when appending other scripts
        base_conditions = "FROM tasks WHERE 1=1"
        params = []

        # Find title that matches the search
        if search:
            base_conditions += " AND title ILIKE %s"
            params.append(f"%{search}%")

        if status and status != "all":
            base_conditions += " AND status = %s"
            params.append(status)

        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(f"SELECT COUNT(*) {base_conditions}", params)
                total = cur.fetchone()["count"]

                cur.execute(
                    f"SELECT * {base_conditions} ORDER BY created_at DESC LIMIT %s OFFSET %s", 
                    params + [page_size, offset]
                )

                tasks = cur.fetchall()

        return tasks, total
            

    def get_by_id(self, task_id: int) -> Optional[dict]:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
                return cur.fetchone()
            
    
    def update(self, task_id: int, fields: dict) -> Optional[dict]:
        set_clause = ", ".join(f"{key} = %s" for key in fields)
        values = list(fields.values()) + [task_id]

        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                        UPDATE tasks SET {set_clause}, updated_at = NOW()
                        WHERE id = %s
                        RETURNING *
                    """,
                    values
                )
                return cur.fetchone()
            
    
    def delete(self, task_id: int) -> bool:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM tasks WHERE id = %s RETURNING id", (task_id,)
                )
                return cur.fetchone() is not None
