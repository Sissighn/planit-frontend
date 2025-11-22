# PlanIt Frontend
[![CI](https://github.com/Sissighn/planit-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Sissighn/planit-frontend/actions/workflows/ci.yml)

This repository contains the frontend for the PlanIt application, a task and time management tool built to support recurring tasks, calendar-based planning, and flexible categorization.  
The frontend is implemented using React, Vite, and TailwindCSS and communicates with the PlanIt backend API.

---

## Features

- Create, update, delete and archive tasks  
- Support for recurring tasks with multiple repetition rules  
- Calendar view with quick add, edit and delete actions  
- Category and group-based task filtering  
- Soft UI design using TailwindCSS and DaisyUI  
- Responsive layout and mobile-friendly interface  
- Integration with backend REST API  
- Jest + React Testing Library test setup  
- Continuous Integration via GitHub Actions  

---

## Tech Stack

- React  
- Vite  
- TailwindCSS  
- DaisyUI  
- Jest  
- React Testing Library  
- GitHub Actions  
- Codecov  

---

## Project Structure
```bash
planit-frontend
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── ThemeSwitch.jsx
│   │   ├── groups/
│   │   ├── layout/
│   │   │   ├── AppContent.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── tasks/
│   │       ├── AddTaskDialog.jsx
│   │       ├── EditTaskDialog.jsx
│   │       ├── TaskItem.jsx
│   │       └── TaskList.jsx
│   ├── view/
│   │   ├── CalendarView.jsx
│   │   └── Greeting.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── recurrence.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── jest.config.cjs
├── tailwind.config.js
├── vite.config.js
└── package.json

```
--- 

## Installation

```bash
git clone https://github.com/Sissighn/planit-frontend.git
npm install
npm run dev
npm run build
npm run preview
```
---

## Running Tests
```bash
npm test
```

---

## API Integration

All requests to the backend are handled in src/services/api.js.
The frontend expects the PlanIt backend application to be running and exposing the required REST endpoints.

---

## License
MIT License © 2025 Setayesh Golshan