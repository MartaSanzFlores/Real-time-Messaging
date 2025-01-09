# My Project: Real-time Messaging with Admin Management

## Description
This project is a full-stack application built with **React** for the frontend and **Node.js** for the backend API. It uses **TypeScript** for the server, with **PostgreSQL** for user management and **MongoDB** for storing messages for the real-time chat functionality. The backend includes a full authentication system (JWT-based), and a **WebSocket** server for real-time messaging.

The first user created will automatically be assigned the **admin** role, and the admin can manage user accounts (e.g., creating, updating, and deleting users). All passwords are securely hashed using **bcrypt** before storing them in the PostgreSQL database.

API documentation is provided via **Swagger**.

## Features
- **React frontend** with real-time updates using WebSockets
- **Node.js backend API** with TypeScript
- **JWT authentication** for secure login and registration
- **PostgreSQL** for user management
- **MongoDB** for storing chat messages
- **Admin role** to manage users
- **WebSocket** support for real-time messaging
- **Swagger API documentation** for easy access to API endpoints

## Technologies Used
- **Frontend**: React, WebSockets
- **Backend**: Node.js, Express, TypeScript, WebSockets, JWT authentication
- **Database**:
  - **PostgreSQL**: User management (storing user details and roles)
  - **MongoDB**: Real-time chat messages
- **Docker**: For containerizing both the frontend and backend
- **Swagger**: For API documentation
- **bcrypt**: For securely hashing user passwords

## Prerequisites
- **Docker**: Ensure you have Docker installed to run the project in containers.
- **Node.js**: Required for development and building the backend.
- **npm or yarn**: Required for managing dependencies.

## Getting Started

### 1. Clone the Repository
First, clone the repository to your local machine:
```bash
git clone https://github.com/MartaSanzF/Test-Kanbios.git
```
### 2. Run the application
Run the application with Docker
```bash
docker-compose up --build
```
This command will:

- Build and start the Node.js API in a Docker container.
- Build and start the React frontend in a Docker container.
- Set up PostgreSQL and MongoDB containers for the database.

Once the containers are running, open your browser and navigate to:

- **Frontend**: http://localhost:5173

### 3. Authentication
When you first run the application, create a user with the following details:

- **Email**: admin@example.com
- **Password**: yoursecurepassword

This user will automatically be assigned the admin role. The admin can then manage other user accounts.

## API Documentation
The backend API is documented using Swagger. You can view the API documentation by visiting:

http://localhost:3000/api-docs

## Endpoints
Here are some of the key API endpoints available in the backend:

- **POST /auth/signup**: Register a new user
- **POST /auth/login**: Login and get a JWT token
- **GET /admin/getUsers**: Get a list of all users (Admin only)
- **GET /admin/getUser/{id}**: Get a specific user by ID (Admin only)
- **POST /admin/createUser**: Create a new user (Admin only)
- **PUT /admin/updateUser/{id}**: Update a user's details (Admin only)
- **DELETE /admin/deleteUser/{id}**: Delete a user (Admin only)
- **POST /messages/sendMessage**: Send a message to a specific user (requires WebSocket connection)

## Real-time Messaging
The chat feature uses **WebSockets** for real-time communication. After logging in, users can send and receive messages instantly. The chat system stores messages in MongoDB and is connected to the frontend using WebSocket.

## Security Considerations

- **Password Security**: Passwords are hashed using bcrypt before being stored in the PostgreSQL database. When users log in, their passwords are validated against the hashed values.
- **JWT Authentication**: The application uses JWT tokens to authenticate API requests. Ensure you keep your JWT secret key safe and do not expose it publicly.
- **Role-based Access Control**: Only users with the admin role can access admin routes such as creating, updating, or deleting users.