# API Routes

## Users

- POST `/api/v1/users/login`
- POST `/api/v1/users/forgot-password`
- POST `/api/v1/users/reset-password/:code`
- GET `/api/v1/users/me`
- PATCH `/api/v1/users/me`
- PATCH `/api/v1/users/me/password`
- GET `/api/v1/users/` (admin)
- POST `/api/v1/users/` (admin)
- GET `/api/v1/users/:id` (admin)
- PATCH `/api/v1/users/:id` (admin)
- DELETE `/api/v1/users/:id` (admin)
- PATCH `/api/v1/users/:id/password` (admin)
- GET `/api/v1/users/:id/worksites` (admin)

## Companies

- GET `/api/v1/companies/`
- POST `/api/v1/companies/`
- GET `/api/v1/companies/:id`
- PATCH `/api/v1/companies/:id`
- GET `/api/v1/companies/:id/resources`
- GET `/api/v1/companies/:id/categories`
- GET `/api/v1/companies/:id/schedules`
- DELETE `/api/v1/companies/:id` (admin)

## Categories

- POST `/api/v1/categories/`
- GET `/api/v1/categories/:id`
- PATCH `/api/v1/categories/:id`
- GET `/api/v1/categories/` (admin)
- DELETE `/api/v1/categories/:id` (admin)

## Resources

- POST `/api/v1/resources/`
- GET `/api/v1/resources/:id`
- PATCH `/api/v1/resources/:id`
- GET `/api/v1/resources/:id/vacations`
- GET `/api/v1/resources/:id/sick-leaves`
- GET `/api/v1/resources/` (admin)
- DELETE `/api/v1/resources/:id` (admin)

## Schedules

- GET `/api/v1/schedules/:id`
- GET `/api/v1/schedules/` (admin)
- POST `/api/v1/schedules/` (admin)
- PATCH `/api/v1/schedules/:id` (admin)
- DELETE `/api/v1/schedules/:id` (admin)

## Work Sites

- GET `/api/v1/work-sites/:id`
- GET `/api/v1/work-sites/` (admin)
- POST `/api/v1/work-sites/` (admin)
- PATCH `/api/v1/work-sites/:id` (admin)

## Work Rules

- GET `/api/v1/work-rules/resolve`
- POST `/api/v1/work-rules/resolve`
- GET `/api/v1/work-rules/:id`
- PATCH `/api/v1/work-rules/:id`
- GET `/api/v1/work-rules/` (admin)
- POST `/api/v1/work-rules/` (admin)
- DELETE `/api/v1/work-rules/:id` (admin)

## Time Entries

- GET `/api/v1/time-entries/`
- POST `/api/v1/time-entries/`
- GET `/api/v1/time-entries/:id`
- PATCH `/api/v1/time-entries/:id`
- DELETE `/api/v1/time-entries/:id`
- PATCH `/api/v1/time-entries/:id/fix-worked-minutes`

## Attendance

- GET `/api/v1/attendance/`
- POST `/api/v1/attendance/`
- GET `/api/v1/attendance/:id`
- PATCH `/api/v1/attendance/:id`
- DELETE `/api/v1/attendance/:id`

## Vacations

- GET `/api/v1/vacations/:id`
- GET `/api/v1/vacations/` (admin)
- POST `/api/v1/vacations/` (admin)
- PATCH `/api/v1/vacations/:id` (admin)
- DELETE `/api/v1/vacations/:id` (admin)

## Sick Leaves

- GET `/api/v1/sick-leaves/:id`
- GET `/api/v1/sick-leaves/` (admin)
- POST `/api/v1/sick-leaves/` (admin)
- PATCH `/api/v1/sick-leaves/:id` (admin)
- DELETE `/api/v1/sick-leaves/:id` (admin)
