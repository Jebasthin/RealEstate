# Jose Estate - Premium Real Estate Platform (Node.js/Express + Next.js)

![Responsive Dashboard Preview](https://img.shields.io/badge/Responsive-Design-emerald)
![Node.js](https://img.shields.io/badge/Node.js-backend-green)
![Next.js](https://img.shields.io/badge/Next.js-frontend-black)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![OpenAPI](https://img.shields.io/badge/Docs-OpenAPI/Swagger-red)

## 🚀 Project Overview

**Jose Estate** is a feature-rich real estate listing and management platform built for the modern property market. It connects **Buyers**, **Sellers**, and **Admins** through a unified interface with advanced features like locality-based filtering, AI-powered property scoring, and a comprehensive moderation system.

### 🎯 Key Features

- **Dual-Panel Dashboard**:
  - **Buyer Portal**: Browse properties with map-based visualization (using `react-leaflet`), saved searches, property comparison, and detailed listing analytics.
  - **Seller Portal**: One-click listing creation, image gallery management, and real-time engagement tracking.

- **Intelligent Location Hierarchy**:
  - Seamless integration of **States** → **Cities** → **Areas/Localities**. The frontend features a responsive 4-column layout for easy navigation on all devices.

- **AI-Powered Property Scoring**:
  - Custom algorithm calculates a "match score" based on buyer preferences, location, price, and property attributes.

- **Advanced Filters & Search**:
  - Comprehensive filtering by price, bedrooms, bathrooms, property type, amenities, and location.
  - **Responsive Search Panel** (4-column grid) that adapts perfectly to mobile.

- **Moderation & Management**:
  - **Admin Panel** for overseeing the platform.
  - **Enquiry Management**: Track and respond to buyer leads with integrated email clients.

- **Security & Data Integrity**:
  - **HttpOnly Cookies** for secure session management.
  - **Password Hashing** (bcrypt) and JWT-based authentication.

### 🛠️ Tech Stack

#### Backend (Node.js + Express)
- **Runtime**: Node.js 22.x
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma (with Pool2 for scalability)
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Validation**: Zod
- **Documentation**: OpenAPI Specification (`swagger-jsdoc`, `swagger-ui-express`)

#### Frontend (Next.js + Tailwind CSS)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom "Café Au Lait" color palette)
- **Mapping**: Leaflet.js (`react-leaflet`)
- **State Management**: Zustand
- **Icons**: Lucide React

### 📍 OpenAPI Documentation (Mandatory Assignment Requirement)

I have installed and configured the complete **OpenAPI Specification framework** in the backend. You can access the interactive documentation directly in your browser:

👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

This catalog includes **every single endpoint** of the API, fully documented with:
- ✅ Request & Response Schemas
- ✅ Example Payloads
- ✅ Authentication Methods
- ✅ Complete Error Handling

---

## 🛠️ Unified Quick-Start Guide

To run this fullstack application on another system, follow these steps:

### 1. Backend Setup & Run
Open a terminal in the project root:
```bash
# Go to backend directory
cd backend

# Install dependencies
npm install

# (Configure database credentials in backend/.env)
# Generate client and sync migrations with database
npx prisma generate
npx prisma migrate dev

# Populate mock numbers for default users
node prisma/updateUsersMobile.js

# Start the server (runs on port 5000)
npm run dev
```

### 2. Frontend Setup & Run
Open a new terminal window in the project root:
```bash
# Go to frontend directory
cd frontend

# Install next/react dependencies
npm install

# Start the development client (runs on port 3000)
npm run dev
```
* **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
* **Backend API Documentation:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

For specific directory details, check individual documentation guides inside:
* 📂 **[Backend Detailed Guide](./backend/README.md)**
* 📂 **[Frontend Detailed Guide](./frontend/README.md)**

---

## 🗄️ Database Restoration (50,000+ Property Records)

The project root contains a pre-populated PostgreSQL database dump named **`jose_realestate_back.sql`** (containing **50,000+ realistic property listings**, cities, states, areas, and seller accounts). This is provided to test the platform's high scalability and indexing speeds.

### How to Restore the Backup:

#### Method A: Using pgAdmin 4 (GUI)
1. Open **pgAdmin 4** on your local machine.
2. Right-click on **Databases** -> **Create** -> **Database...** and name it `jose_estate`.
3. Right-click on the newly created `jose_estate` database and click **Restore...**
4. In the Restore dialog:
   - For **Filename**, click the browse button, choose the file filter to `All files (*)` or SQL, and select **`jose_realestate_back.sql`** from this project's root folder.
   - Click the **Restore** button at the bottom.

#### Method B: Using PostgreSQL CLI (`psql`)
Open your terminal and execute:
```bash
# 1. Create the database
createdb -U postgres jose_estate

# 2. Restore the SQL backup file
psql -U postgres -d jose_estate -f jose_realestate_back.sql
```

### ⚙️ Update Backend `.env` Connection Password
Once the database is successfully restored, open **`backend/.env`** and replace the connection password with your pgAdmin/PostgreSQL password:
```env
DATABASE_URL="postgresql://postgres:YOUR_PGADMIN_PASSWORD_HERE@localhost:5432/jose_estate?schema=public"
```

---

## 🔑 Demo Login Credentials

You can use the following default accounts to log in and evaluate each user panel. **Note: All accounts in the database share the same password: `123456`**.

| Portal / Role | Email Address | Password | Description / Action |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | `admin123@gmail.com` | `123456` | Accesses the Admin Moderation Queue and Master tables. |
| **Seller Portal** | `seller123@gmail.com` | `123456` | Owns the **50,000+ mock property listings** restored from the SQL backup file. |
| **Buyer Portal** | `buyer123@gmail.com` | `123456` | Accesses the Buyer search interface, saved searches, and lead/enquiry forms. |

💡 **Pro-Tip for Evaluators:** You can log in as Admin (`admin123@gmail.com`) to inspect the complete user directory under the **User Master** menu to see other registered profiles.