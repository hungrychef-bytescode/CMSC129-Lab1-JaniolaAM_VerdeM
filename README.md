# 📝 heyToday — Task Manager App
### CMSC129 Laboratory 1
**Authors:** Janiola AM & Verde M

---

## 📖 Overview

**heyToday** is a full-stack task management web application built with the FERN stack (Firebase, Express, React, Node.js). It allows users to organize tasks into lists, track progress, and manage task priorities and statuses in real time using Firebase Firestore as the database.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | Firebase Firestore |
| Styling | Inline CSS (React) |
| Backup | MongoDB |

---

## 📁 Project Structure

```
CMSC129-Lab1/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── CircleProgress.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── constants/
│   │   │   └── taskConstants.ts
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts       # API calls to backend
│   │   └── App.tsx
│   └── package.json
│
├── server/                  # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.ts
│   │   │   └── serviceAccountKey.json  # ⚠️ Not committed to GitHub
│   │   ├── controllers/
│   │   │   ├── listController.ts
│   │   │   └── taskController.ts
│   │   ├── routes/
│   │   │   ├── list.ts
│   │   │   └── task.ts
│   │   └── server.ts
│   └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- A Firebase project with Firestore enabled

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CMSC129-Lab1-JaniolaAM_VerdeM.git
cd CMSC129-Lab1-JaniolaAM_VerdeM
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Then add your Firebase service account key:
- Go to [Firebase Console](https://console.firebase.google.com)
- Navigate to **Project Settings → Service Accounts**
- Click **Generate new private key**
- Save the downloaded file as `serviceAccountKey.json` inside `server/src/config/`

> ⚠️ **Never commit `serviceAccountKey.json` to GitHub.** Make sure it is listed in `.gitignore`.

Start the backend server:

```bash
npm run dev
```

The server will run at `http://localhost:5000`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 🚀 Usage Guide

1. Open `http://localhost:5173` in your browser
2. **Create a list** using the input field in the sidebar and press `+` or `Enter`
3. **Select a list** to view its tasks
4. **Add tasks** using the `+ Add task` button
5. Each task has a **priority** (Low / Medium / High) and **due date**
6. Use the **▶ Start** button to mark a task as In Progress
7. Use the **✓ Complete** button to mark a task as Completed
8. Switch between **Dashboard** and **My Tasks** views using the sidebar navigation
9. The **Dashboard** view shows task status charts and completed tasks
10. **Delete** tasks or lists using the 🗑 button

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

### Lists

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| GET | `/lists` | Get all lists | — |
| POST | `/lists` | Create a new list | `{ "name": "string" }` |
| DELETE | `/lists/:id` | Delete a list by ID | — |

### Tasks

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| GET | `/tasks?list_id=` | Get all tasks for a list | — |
| POST | `/tasks` | Create a new task | `{ "task": "string", "priority": "string", "due_date": "string", "list_id": "string" }` |
| PUT | `/tasks/:id/task` | Update task name | `{ "task": "string" }` |
| PUT | `/tasks/:id/status` | Update task status | `{ "status": 0 \| 1 \| 2 }` |
| PUT | `/tasks/:id/priority` | Update task priority | `{ "priority": "string" }` |
| PUT | `/tasks/:id/due_date` | Update due date | `{ "due_date": "string" }` |
| PUT | `/tasks/:id/soft-delete` | Soft delete a task | — |
| PUT | `/tasks/:id/restore` | Restore a soft-deleted task | — |
| DELETE | `/tasks/:id` | Permanently delete a task | — |

### Task Status Values

| Value | Meaning |
|---|---|
| `0` | Not Started |
| `1` | In Progress |
| `2` | Completed |

---

## 🔒 Environment & Security Notes

- `serviceAccountKey.json` must **never** be pushed to GitHub
- Add it to `.gitignore`:
  ```
  server/src/config/serviceAccountKey.json
  ```

---

## 📄 License

This project was created for academic purposes as part of CMSC129 — Assign 1.
