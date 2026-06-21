from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .router import router as task_router
from .init_db import init_db

app = FastAPI(title="Task Manager")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(task_router)

@app.get("/")
def root():
    return {"message": "App is running."}