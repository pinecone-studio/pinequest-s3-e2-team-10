# PineQuest LMS

Hackathon-ready LMS scaffold with a simple `frontend/` and `backend/` split.

## Why this structure works

This project is a good candidate for "simple is more" because your core demo flow is linear:

`login -> create exam -> assign -> take exam -> submit -> grade -> view results -> report`

For a 2-week competition, the right move is not a big enterprise architecture. The right move is:

- clear role-based screens
- feature-based backend modules
- one strong end-to-end demo flow
- visible reporting for judges

## Project structure

```text
frontend/
  src/app/
    (auth)/login
    (reviewer)/reviewer/dashboard
    (reviewer)/reviewer/assessments
    (reviewer)/reviewer/assignments
    (reviewer)/reviewer/reports
    (candidate)/candidate/dashboard
    (candidate)/candidate/exams/[examId]
    (candidate)/candidate/results
  src/components/layout
  src/services
  src/types

backend/
  src/modules/
    auth
    users
    courses
    assessments
    assignments
    submissions
    results
    reports
```

## Recommended build scope

Build these first:

1. Role-based login
2. Reviewer creates exam
3. Reviewer assigns exam to candidate
4. Candidate takes and submits exam
5. System shows score and pass/fail
6. Reviewer sees report summary

Defer these unless you finish early:

1. Complex permissions
2. Deep analytics
3. Real-time proctoring
4. File-heavy training workflows
5. Advanced notification systems

## Team split for 9 members

Suggested ownership:

1. Frontend auth + shared layout
2. Reviewer dashboard + assessments UI
3. Reviewer assignments UI
4. Candidate dashboard + exam-taking UI
5. Candidate results + report UI polish
6. Backend auth + users
7. Backend assessments + assignments
8. Backend submissions + results + reports
9. Integration, QA, demo script, seed data

## Local development

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run start:dev
```

Expected local ports:

- frontend: `http://localhost:3000`
- backend: `http://localhost:3001/api`

## Deployment stack

Recommended for this hackathon:

- Frontend: Next.js on Vercel
- Backend: NestJS on Railway or Render
- Database: Supabase Postgres or Neon Postgres
- File storage: Supabase Storage or Cloudinary

Why this stack:

- fast setup
- easy team onboarding
- low DevOps overhead
- good enough for demo-scale traffic

If Vercel is blocked for now, keep the frontend deploy decision open and continue with CI only. The app structure still fits Vercel best once your account issue is fixed.

## CI strategy

Keep CI strict enough to catch broken merges, but not so strict that it slows the team down.

Current recommendation:

1. Frontend lint
2. Frontend build
3. Backend build
4. Backend test

This is a good hackathon baseline because it answers the main question:

`can this branch still build and run the core product?`

GitHub Actions workflow:

- `.github/workflows/ci.yml`

## API starter routes

- `GET /api`
- `GET /api/auth/roles`
- `GET /api/users`
- `GET /api/courses`
- `GET /api/assessments`
- `GET /api/assignments`
- `GET /api/submissions`
- `GET /api/results`
- `GET /api/reports/summary`
