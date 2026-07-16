# Jose Estate - Node.js/Express Backend Setup Guide

This directory contains the REST API server for the Jose Estate platform, built using Node.js, Express, Prisma ORM, and PostgreSQL database.

---

## 🛠️ Prerequisites
Before running the backend on another system, make sure you have the following installed:
* **Node.js**: Version `18.x` or `20.x` (recommended)
* **PostgreSQL**: Running instance of a PostgreSQL database

---

## 🚀 Setup & Installation Steps

### 1. Install Dependencies
Navigate to the `backend` folder in your terminal and install the required npm packages:
```bash
cd backend
npm install
```
*(This installs Express, Prisma Client, cors, bcryptjs, jsonwebtoken, zod validation, swagger documentation, and development packages like nodemon.)*

### 2. Configure Environment Variables
Create a file named `.env` in the `backend` root folder and populate it with your local credentials:
```env
# Database Connection String (Replace with your own PostgreSQL credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/jose_estate?schema=public"

# Backend server configurations
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Secret keys for security tokens (JWT)
JWT_SECRET="your_jwt_access_secret_key_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key_here"
```

### 3. Initialize Database & Run Migrations
Run these commands to apply database schemas and generate the Prisma Client matching your tables:
```bash
# Generate the Prisma database client
npx prisma generate

# Run migrations to build the tables in your PostgreSQL database
npx prisma migrate dev
```

### 4. Optional: Initialize Mock Data (Database Seed)
To pre-populate your database with mock listings, areas, cities, and initial accounts (with mobile numbers configured):
```bash
# Run database seeds
npm run db:seed  # OR npx prisma db seed

# Initialize user mobile numbers (legacy setup update)
node prisma/updateUsersMobile.js
```

---

## 🏃 Running the Backend Server

### Development Mode (Auto-reloads on save using nodemon)
```bash
npm run dev
```

### Production Mode (Standard Node runner)
```bash
npm start
```

---

## 📍 Swagger API Documentation
Once the server is running, the Swagger interactive OpenAPI specs are accessible directly at:

👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**
