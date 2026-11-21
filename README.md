# RatePoint – Store Rating System

A full-stack web application that allows users to discover stores and submit ratings. The platform provides separate dashboards and features for Administrators, Normal Users, and Store Owners.

## Features

### Admin
- View dashboard statistics.
- Create and manage users.
- Create and manage stores.
- Search, filter, and sort users and stores.
- View individual user details.

### Normal User
- Register and log in.
- Browse and search stores.
- View average store ratings.
- Submit ratings from 1 to 5.
- Update previously submitted ratings.
- Change password.

### Store Owner
- View store dashboard statistics.
- View owned stores.
- View customer ratings and customer details.
- View average store ratings.
- Change password.

## Technology Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs
- Express Validator

## Project Structure

```text
store-rating-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd store-rating-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
JWT_SECRET=YOUR_PRIVATE_SECRET
```

Create the PostgreSQL database named `store_rating_db` and execute the database schema provided with the project.

Start the backend:

```bash
npm run dev
```

Backend URL: `http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Authentication and Authorization

The application supports three roles:

- ADMIN
- USER
- OWNER

JWT authentication protects private routes and role-based middleware restricts access to authorized users.

## Database

PostgreSQL is used to store:

- Users
- Stores
- Ratings

Each user can submit one rating per store. Existing ratings can be updated.

## Security

- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Protected frontend routes.
- Backend role-based authorization.
- Environment variables are used for sensitive configuration.

## Author

**Prashant Pandey**

- GitHub: https://github.com/Prashant7385
