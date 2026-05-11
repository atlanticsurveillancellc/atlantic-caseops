# Atlantic CaseOps v0

A working starter build for a web-based surveillance CRM.

## What is included

- Next.js frontend in `frontend/`
- FastAPI backend in `backend/`
- SQLite local database by default
- PostgreSQL-ready config via `DATABASE_URL`
- S3 presigned upload service placeholder for evidence uploads
- Case management API
- Daily update API
- Dashboard / cases / daily update builder / evidence / billing / mileage / users / client portal UI

## Local setup

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env
python -m app.seed
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/docs
```

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## AWS production target

Recommended first production path:

- Frontend: AWS Amplify Hosting
- Backend: AWS Elastic Beanstalk or ECS later
- Database: Amazon RDS PostgreSQL
- Evidence files: Amazon S3 private bucket
- Authentication: Amazon Cognito

## Security notes before real client use

Do not use this with real claimant/client data until production auth, HTTPS, audit logs, backups, and access controls are completed.
