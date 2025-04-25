# 📝 Node.js Backend for Notes & Tasks App

This is the backend of a fullstack web application built using **pure Node.js**, without any frameworks like Express.  
Users can **create, edit, save, and manage personal notes and tasks**, all secured with **JWT authentication**.

---

## 🚀 Features

- **🔗 Modular Routing System**  
  Routes are separated into individual modules for better organization:
  - `/users` – handles registration, login, and user-related actions
  - `/notes` – create, read, update, and delete notes
  - `/tasks` – manage task creation, status updates, and deletions
  - `/files` – (optional) manage file uploads and downloads

- **🔐 Google Authentication with JWT**  
Users can securely sign in using their **Google accounts**.  
Once authenticated, a **JWT token** is issued, which is used to verify and authorize access to protected routes like creating, editing, or deleting notes and tasks.

- **⚙️ Pure Node.js**  
  No frameworks used – all request handling is done using built-in Node.js modules like `http`, `fs`, `url`, etc.  
  This provides full control over server logic and routing.
