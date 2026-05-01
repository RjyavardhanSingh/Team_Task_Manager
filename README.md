# Team Task Manager

A full-stack task and project management app with role-based access control.

## 1. Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Zod
- Frontend: React (Vite), React Router, Zustand, Axios, Tailwind CSS, lucide-react

## 2. Core Features

- Authentication: Register/Login with JWT
- Roles:
  - `Admin`: create projects, manage team members, create/assign tasks
  - `Member`: view assigned projects, create tasks, self-assignment, update task status
- Dashboard metrics:
  - total tasks, todo, in progress, completed
  - overdue task list
- Project management with team member assignment by email
- Task management with assignment by email (or ID), status updates, due dates

## 3. Project Structure

```text
Team_Task_Manager/
├── client/               # React frontend
│   ├── src/
│   ├── .env
│   └── .env.production
├── server/               # Express backend
│   ├── src/
│   ├── .env
│   └── .env.example
└── README.md
```

## 4. Requirements

- Node.js `18+` (recommended `20+`)
- npm `9+`
- MongoDB Atlas or local MongoDB instance

## 5. Environment Setup

### 5.1 Backend (`server/.env`)

Create `server/.env` from template:

```bash
cp server/.env.example server/.env
```

Template values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace_with_a_long_random_secret
```

### 5.2 Frontend

Local dev file (`client/.env`):

```env
VITE_API_URL=http://localhost:5000
```

Production file (`client/.env.production`):

```env
VITE_API_URL=https://your-backend-domain.com
```

## 6. Install Dependencies

From project root:

```bash
cd server && npm install
cd ../client && npm install
```

## 7. Run Locally

Use two terminals.

### Terminal 1: Backend

```bash
cd server
npm run dev
```

Server runs at `http://localhost:5000`.

### Terminal 2: Frontend

```bash
cd client
npm run dev
```

Client runs at `http://localhost:5173`.

## 8. Scripts

### Backend (`server/package.json`)

- `npm run dev` -> start with nodemon + `.env`
- `npm start` -> start with node

### Frontend (`client/package.json`)

- `npm run dev` -> Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview built app
- `npm run lint` -> lint source code

## 9. API Base and Routes

Base URL: `http://localhost:5000/api`

- Auth:
  - `POST /auth/register`
  - `POST /auth/login`
- Projects:
  - `GET /projects`
  - `POST /projects` (Admin)
- Tasks:
  - `GET /task/:projectId`
  - `POST /task`
  - `PATCH /task/:taskId/status`
- Dashboard:
  - `GET /dashboard`

## 10. Auth Flow

- On login/register, backend returns token and user
- Frontend stores token/user in Zustand + localStorage
- Axios interceptor sends `Authorization: Bearer <token>`
- On `401`, frontend auto-logs out and redirects to `/login`

## 11. Build for Production

```bash
cd client
npm run build
```

Frontend output will be in `client/dist`.

Backend production start:

```bash
cd server
npm start
```

Set production env values before start (`NODE_ENV=production`, real `MONGO_URI`, strong `JWT_SECRET`).

## 12. Troubleshooting

- `403 on project create`:
  - Ensure logged-in user role is exactly `Admin`
  - Re-login after role changes in DB
- `Invalid request data` for task creation:
  - Ensure `project` is valid project ID
  - Ensure `dueDate` is valid date string (e.g. `2026-05-30`)
  - For assignment, use a registered email
- CORS/API errors:
  - Verify `client/.env` points to backend URL
  - Confirm backend is running on expected port
