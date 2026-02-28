# 🔥 TaskMate

TaskMate is a full-stack task management web application designed for productivity. Create, organize, and track tasks with smart prioritization (High, Medium, Low, Custom deadlines), advanced filtering, and a real-time dashboard with visual stats. Built with React 19, Vite, Tailwind CSS, Redux Toolkit on the frontend and Express.js with PostgreSQL + Prisma on the backend. Features JWT authentication, toast notifications, and a custom-crafted "Ember" dark theme with warm orange accents and glassmorphism effects — inspired by modern SaaS tools like Raycast and Arc Browser.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, React Router, Lucide Icons

**Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT Auth

**Desktop:** Electron (optional)

## Features

- Create, edit, delete, and mark tasks as complete
- Priority levels — High, Medium, Low, Custom (with deadline)
- Filter tasks by title, category, priority, status, and date
- Dashboard with task stats and progress tracking
- User authentication (signup/login)
- Toast notifications for all actions
- Fully responsive design

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskmate
JWT_SECRET=your_secret_key
PORT=8081
```

### 3. Setup database

```bash
cd backend
npx prisma migrate dev
cd ..
```

### 4. Run the app

```bash
npm run both
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8081

## Build

```bash
# Web
npm run build

# Desktop (Electron)
npm run dist
```

## Author

**Koshti Dhiren Prakashbhai**
