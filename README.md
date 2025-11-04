TaskManagement is a full-stack task management application built with React.js, Redux, Express.js, and TypeScript.
It provides an efficient and secure environment for project and task handling, including automated deadline reminders and role-based access.

🚀 Features

🧩 Project & Task CRUD — Create, read, update, and delete both projects and tasks.

👥 Role-based Access Control — Supports different user roles (Admin, Manager, Employee).

⏰ Automated Deadline Alerts — A scheduled cron job runs daily at 9 AM, sending reminders for tasks whose deadlines are within 24 hours.

🍪 Secure Authentication — Uses HTTP-only cookies for tokens (no local storage usage) to enhance security.

🔄 State Management — Implemented using Redux for predictable data flow between components.

🧱 Modular Architecture — Clearly separated frontend, backend, and service layers for maintainability.

⚙️ TypeScript Integration — Provides strong type safety across frontend and backend.

🌐 Deployed on AWS EC2 — Hosted frontend (React + Vite) with Nginx and backend (Express.js) with PM2.

🔐 HTTPS Ready — Configured using Certbot and Let’s Encrypt for secure SSL connections.

🏗️ Architecture
TaskManagement/
├── frontend/              # React + Redux + TypeScript (UI)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── vite.config.ts
│
 ── backend/               # Express.js + TypeScript (API)
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── services/
    │   ├── models/
    │   ├── middlewares/
    │   ├── utils/
    │   └── app.ts
   ├── .env
   └── tsconfig.js

Security

HTTP-only Cookies are used for authentication tokens.

No sensitive data is stored in localStorage or sessionStorage.

Backend uses CORS with explicit allowed origins.

🧰 Tech Stack
Layer	Technology
Frontend	React.js, Redux Toolkit, TypeScript, Vite
Backend	Express.js, TypeScript, Node.js
Database	MongoDB
Auth	JWT + HTTP-only Cookies
Scheduler	node-cron
Deployment	AWS EC2 + Nginx + PM2
Security	HTTPS (Let’s Encrypt)

🧑‍💻 Development Scripts
Frontend
cd frontend
npm run dev        # Start development server
npm run build

cd backend
npm run dev        # Run with ts-node (watch mode)
npm run build      # Compile TypeScript
npm start 

🌍 Deployment Notes

Frontend: Hosted at /home/ubuntu/Task-management/frontend/dist via Nginx

Backend: Runs via PM2 at port 8000

SSL Certificates: Managed using Certbot

Node.js: Recommended version >=20.19.0
