# Transaction Ledger App

A full-stack transaction ledger application with a React frontend and an Express + MongoDB backend. The app lets a user view their current balance, send money to another user, and review transaction history.

## Features

- Dashboard with current balance
- Send money between registered users
- View transaction history for the logged-in user
- MongoDB-backed transaction storage
- Secure transaction workflow using MongoDB sessions
- React + Vite frontend for a modern UI

## Tech Stack

- Frontend: React, Vite, Axios
- Backend: Node.js, Express
- Database: MongoDB
- API style: REST

## Project Structure

```text
transaction-ledger-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── db.js
│   │   ├── server.js
│   │   └── ...
│   ├── package.json
│   ├── seed.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── package.json
├── transaction-ledger.py
├── .gitignore
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js installed
- MongoDB running locally
- Access to a terminal / command prompt

## MongoDB Setup

If you are using a local MongoDB instance, make sure MongoDB is running before starting the backend.

Example:

```bash
mongod --dbpath "C:/data/db"
```

## Backend Setup

1. Open a terminal in the backend folder.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create or confirm your environment file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=transaction_ledger
```

4. Start the backend server:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

1. Open a terminal in the frontend folder.
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the frontend app:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Default App Flow

- Rahul is the main user in the dashboard.
- Users can send money to Anil or Suresh.
- The backend validates the sender, receiver, and account balance before completing the transfer.
- Transaction history is returned for the selected user.

## API Endpoints

### Users

- `GET /api/users` — get all users

### Transactions

- `GET /api/transactions/:userId` — view transaction history for a user
- `POST /api/transactions` — transfer money
- `POST /api/transactions/reverse/:id` — reverse a completed transaction

## Notes

- The app expects a local MongoDB instance to be running for database operations to work.
- If MongoDB is not running, the backend will fail to connect and the app will not function correctly.
- The project includes seeded transaction/user data that should be loaded into MongoDB before testing the app flow.

## Run the App

Open two terminals:

```bash
# Terminal 1
cd backend
npm start
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Then open the frontend in the browser and use the dashboard.

## License

This project is for learning and demonstration purposes.
