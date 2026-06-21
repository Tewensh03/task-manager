TECH STACK

BACKEND:
FastAPI — Backend framework
psycopg2 — PostgreSQL driver (raw SQL, no ORM)

FRONTEND: 
React + TypeScript via Vite
TanStack React Query — server state and data fetching
Zustand — local UI state (search, filter, pagination)
Axios — HTTP client
Tailwind CSS — styling
Lucide React — icons

------------------------

PREREQUISITES

Python 3.11+
Node.js 18+
PostgreSQL 14+ (running locally or remotely)

------------------------

BACKEND SETUP

Run the commands in your terminal:

Create virtual environment
`python -m venv .venv`

Activate virtual env
Windows(Powershell): `.\.venv\Scripts\Activate.ps1`
Mac/Linux: `source venv/bin/activate`

Install requirements.txt
`pip install -r requirements.txt`

In your postgreSQL database, create a database
`CREATE DATABASE task_manager;`

Create a .env file in the project root
Add your database URL:
`DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db`

Run the application
`uvicorn app.main:app --reload`

By default, backend will run at `http://localhost:8000`

-----------------------

FRONTEND SETUP

Run the commands in your terminal:

Install dependencies
`npm install`

Run the application
`npm run dev`

By default, frontend will run at `http://localhost:5173`

-----------------------