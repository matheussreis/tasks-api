# Tasks API

This project is a task management API that enables users to efficiently manage tasks and their associated projects. It provides endpoints to create, update, delete, and organize tasks, as well as manage projects and assign tasks to them.

## Table of Contents

1. [To-Do](#to-do)
   - [Tasks](#tasks)
   - [Projects](#projects)
2. [Getting Started](#getting-started)
   - [Starting MongoDB with Docker](#starting-mongodb-with-docker)
   - [Environment Variable Setup](#environment-variable-setup)
   - [Starting the Project](#starting-the-project)

## To-Do

### Tasks

1. **Create a new MongoDB database**: `todoList`
2. **Create a new MongoDB collection**: `tasks`
3. **Define the data structure** for MongoDB documents in the `tasks` collection (based on the requirements below).
4. **Create endpoints with Node.js and Express** to:
   - **a.** Create a task
   - **b.** List all tasks
   - **c.** Edit a task
   - **d.** Delete a task
   - **e.** Mark a task as "To-do" or "Done"
   - **f.** Filter tasks by status
   - **g.** Search tasks by name
   - **h.** Sort tasks by dates:
     - Start date
     - Due date
     - Done date

### Projects

Create endpoints for managing projects. Tasks can now be assigned to a project.

1. **Create a new MongoDB collection**: `projects`
2. **Define the data structure** for MongoDB documents in the `projects` collection (based on the requirements below).
3. **Create endpoints with Node.js and Express** to:
   - **a.** Create a project
   - **b.** List all projects
   - **c.** Edit a project
   - **d.** Delete a project
   - **e.** Assign a task to a project
   - **f.** Filter tasks by project name
   - **g.** Sort projects by dates:
     - Start date
     - Due date

## Getting Started

### Starting MongoDB with Docker

If you don't have a MongoDB instance running locally, you can easily use Docker to create a container for this application's database. After installing Docker and setting it up on your machine, navigate to the project's root directory (where the compose.yaml file is located) in your terminal, and run the following command:

```bash
docker-compose up
```

### Environment Variable Setup

Before starting the API server, you'll need to configure your environment variables to connect to MongoDB. To do that, you can follow the steps below:

**1.** Create a `.env` file from the `.env.example` template by running the following command in your terminal:

```bash
cp .env.example .env
```

**2.** Edit the .env file you just created and replace the placeholder values with your MongoDB connection details. The database name can remain as todoList for now, but make sure to update the connection string.

Here’s a table to help you understand the required variables:

| Key                     | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| MONGO_CONNECTION_STRING | The MongoDB connection string.                           |
| MONGO_CONNECTION_STRING | The name of your MongoDB database `(default: todoList)`. |

**Note:** If you choose to use Docker for the MongoDB database, ensure that the connection details match those specified in the `docker-compose.yaml` file.

### Starting the Project

Once your environment variables are set up, you can start the project in development mode by running:

```bash
npm run start
```
