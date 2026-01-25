# Database Structure Documentation

The Interest Calculator WebApp uses **MongoDB** (NoSQL) to store data. Below is the schema for each collection.

## 1. Users Collection
Stores the main app users who manage their own finance dashboards.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `fullName` | String | User's display name |
| `email` | String | Unique login email |
| `password` | String | Hashed password (Bcrypt) |
| `createdAt` | Date | Account creation timestamp |

## 2. Accounts Collection
Stores the contacts/profiles (Borrowers/Investors) linked to a user.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Ref to User (Owner) |
| `name` | String | Contact's name |
| `phone` | String | Contact's phone number |
| `address` | String | Physical address |
| `role` | String | 'Investor' or 'Borrower' |
| `outstandingBalance` | Number | Net amount owed or owing |

## 3. Transactions Collection
Stores specific money movements.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Ref to User |
| `accountId` | ObjectId | Ref to Account (Contact) |
| `amount` | Number | Principal amount |
| `type` | String | 'Given' (Lend) or 'Taken' (Borrow) |
| `interestRate` | Number | Rate in percentage |
| `interestType` | String | 'Simple' or 'Compound' |
| `paymentFrequency`| String | 'Monthly', 'Yearly', etc. |
| `screenshot` | String | Path/URL to receipt image |
| `status` | String | 'Active', 'Completed', 'Overdue' |
