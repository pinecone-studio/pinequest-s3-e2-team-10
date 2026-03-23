# Backend

NestJS API scaffold for the LMS demo.

## Modules

- `auth`
- `users`
- `courses`
- `assessments`
- `assignments`
- `submissions`
- `results`
- `reports`

## Guidelines

- Keep each module focused on one business responsibility.
- Start with in-memory data or mock responses if needed.
- Implement only the endpoints required by the demo flow first.
- Add database integration only after the flow is stable.

## Starter endpoints

- `GET /api`
- `GET /api/auth/roles`
- `GET /api/users`
- `GET /api/courses`
- `GET /api/assessments`
- `GET /api/assignments`
- `GET /api/submissions`
- `GET /api/results`
- `GET /api/reports/summary`
