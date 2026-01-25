# Interest Calculator API Documentation

This document outlines the available API endpoints for the Interest Calculator WebApp.

## Base URL
`http://localhost:5000/api`

## Authentication
Most routes require a JWT token to be sent in the header:
`x-auth-token: <your_token>`

---

### 1. Auth Routes
Managing user registration and sessions.

#### POST `/auth/register`
- **Body**: `{ fullName, email, password }`
- **Description**: Creates a new user account.

#### POST `/auth/login`
- **Body**: `{ email, password }`
- **Description**: Authenticates user and returns a JWT token.

---

### 2. Account Routes
Managing linked profiles (Investors/Borrowers).

#### POST `/accounts` (Protected)
- **Body**: `{ name, phone, address, role }`
- **Description**: Creates a new linked profile.

#### GET `/accounts` (Protected)
- **Description**: Returns all accounts linked to the user.

#### GET `/accounts/:id` (Protected)
- **Description**: Returns a single account's details.

---

### 3. Transaction Routes
Recording money lent or borrowed.

#### POST `/transactions` (Protected)
- **Body**: `{ accountId, amount, type, interestRate, interestType, paymentFrequency, notes }`
- **Description**: Saves a transaction and updates the account balance.

#### GET `/transactions/:accountId` (Protected)
- **Description**: Returns history for a specific profile.

---

### 4. Stats Routes
Dashboard summaries.

#### GET `/stats/overview` (Protected)
- **Description**: Returns total outstanding balance, top performing accounts, and current due payments.
