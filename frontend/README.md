# Frontend

Next.js app-router scaffold for the LMS demo.

## Focus

Keep the frontend simple and role-based:

- `login`
- `reviewer/dashboard`
- `reviewer/assessments`
- `reviewer/assignments`
- `reviewer/reports`
- `candidate/dashboard`
- `candidate/exams/[examId]`
- `candidate/results`

## Guidelines

- Build the exact demo flow first before adding extra pages.
- Reuse shared layout and visual components.
- Prefer simple forms and tables over advanced UI patterns.
- Keep state local unless multiple pages truly need it.
