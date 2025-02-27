# Expense Tracker Backend

## Description

The Expense Tracker Backend is a RESTful API built with Node.js, Express, and MongoDB. It provides a robust backend service for managing user authentication, expense tracking, and budget management. This API allows users to sign up, sign in, manage their profiles, and track their expenses efficiently.

## Features

- **User Authentication**: Secure user registration and login using JWT tokens.
- **Profile Management**: Update user profiles with fields like full name and email.
- **Expense Tracking**: Add, update, and delete expenses.
- **Budget Management**: Set and manage budgets for different categories.
- **Subscription Management**: Subscribe to different plans and manage subscriptions.
- **Monthly Reports**: Generate monthly expense reports.
- **Middleware**: Includes middleware for authentication and error handling.
- **Environment Configuration**: Uses dotenv for environment variable management.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user and expense data.
- **Mongoose**: ODM for MongoDB to manage data models and schemas.
- **JWT**: JSON Web Tokens for secure user authentication.
- **bcrypt**: Library for hashing passwords.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **node-cron**: Library for scheduling tasks.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/expense-tracker-backend.git
    cd expense-tracker-backend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    JWT_ACCESS_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    ACCESS_TOKEN_EXPIRES_IN=1h
    REFRESH_TOKEN_EXPIRES_IN=7d
    CORS_ORIGIN=your_frontend_url
    ```

4. **Start the server**:
    ```sh
    npm run dev
    ```

## API Endpoints

### User Routes

- `POST /api/v1/users/signup`: Register a new user.
- `POST /api/v1/users/signin`: Log in an existing user.
- `POST /api/v1/users/signout`: Log out the current user.
- `POST /api/v1/users/change-password`: Change the user's password.
- `PUT /api/v1/users/profile`: Update the user's profile.

### Expense Routes

- `POST /api/v1/expenses`: Add a new expense.
- `GET /api/v1/expenses`: Get all expenses for the authenticated user.

### Subscription Routes

- `POST /api/v1/subscription/subscribe`: Subscribe to a plan.
- `POST /api/v1/subscription/unsubscribe`: Unsubscribe from a plan.

### Monthly Report Route

- `GET /api/v1/monthly-report`: Generate a monthly expense report.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.
