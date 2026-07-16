# Jose Estate - Next.js Frontend Setup Guide

This directory contains the user-facing frontend interface for the Jose Estate platform, built using Next.js (App Router) and styled with Tailwind CSS.

---

## 🛠️ Prerequisites
Before running the frontend on another system, make sure you have the following installed:
* **Node.js**: Version `18.x` or `20.x` (recommended)
* **npm**: Installed automatically with Node.js

---

## 🚀 Setup & Installation Steps

### 1. Install Dependencies
Navigate to the `frontend` folder in your terminal and install all required packages:
```bash
cd frontend
npm install
```
*(This command reads `package.json` and installs Next.js, Tailwind, React Leaflet, Lucide icons, and all other necessary packages.)*

### 2. Configure Environment Variables
Create a file named `.env.local` in the `frontend` root directory and add the backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
*Note: If your backend is running on a different port or server, change `http://localhost:5000` to your backend's host address.*

---

## 🏃 Running the Application

### Development Mode
To start the Next.js development server with hot-reloading (auto-updating on changes):
```bash
npm run dev
```
* Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

### Production Mode
For optimal performance and search-engine (SEO) indexing compatibility:

1. **Build the production bundle:**
   ```bash
   npm run build
   ```
2. **Start the optimized server:**
   ```bash
   npm start
   ```
