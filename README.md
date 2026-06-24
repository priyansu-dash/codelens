# CodeLens

An AI-powered web application that analyzes, explains, and refactors your code in real time. Built with a React (Vite) frontend, a Node.js (Express) backend, and powered by the Groq API (Llama 3.3 70B) for lightning-fast inference.

## Features

- **Code Analysis**: Paste any code snippet and get a detailed breakdown of what it does, its time and space complexity, and a refactored version.
- **Lightning Fast AI**: Powered by Groq (Llama 3.3 70B Versatile), returning complete code analysis in sub-second speeds.
- **Monaco Editor Integration**: Features a built-in VS Code-style editor (Monaco Editor) for smooth, syntax-highlighted code input.
- **Multi-language Support**: Supports Python, JavaScript, C++, Java, Rust, and Go.
- **Secure Authentication**: User registration and login using JWTs and bcrypt.
- **History Management**: Automatically saves your last 10 snippet analyses to a Neon PostgreSQL database. You can rename snippets for easy reference or delete them directly from the UI.
- **Modern UI**: A responsive, dark-mode-first aesthetic built with Tailwind CSS and shadcn/ui.

## Tech Stack

### Frontend
- React 18 (Vite)
- Monaco Editor (`@monaco-editor/react`)
- Tailwind CSS v4 & shadcn/ui
- React Markdown (for rendering AI responses)
- Axios

### Backend
- Node.js & Express.js
- PostgreSQL (via Neon Serverless)
- Groq SDK (`llama-3.3-70b-versatile`)
- JWT (Authentication)
- bcryptjs (Password Hashing)

## Local Development

### Prerequisites
- Node.js installed
- A Postgres database (e.g., Neon free tier)
- A Groq API Key

### Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GROQ_API_KEY=your_groq_api_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Setup Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Deployment

- **Frontend**: Designed to be deployed on Vercel or Netlify.
- **Backend**: Designed to be deployed on Render, Railway, or Fly.io. Ensure environment variables are configured on your hosting platform.

## License
MIT
