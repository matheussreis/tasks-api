# Tasks API

## Table of Contents

1. [To-Do](#to-do)
   - [Tasks](#tasks)
   - [Projects](#projects)
2. [Getting Started](#getting-started)
   - [Environment Variable Setup](#environment-variable-setup)
   - [Running the Project](#running-the-project)

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

### Environment Variable Setup

Before running the API project, you'll need to configure your environment variables to connect to MongoDB. Follow these steps:

**1.** Create a `.env` file from the `.env.example` template by running the following command in your terminal:

```bash
cp .env.example .env
```

**2.** Edit the .env file you just created and replace the placeholder values with your MongoDB connection details. The database name can remain as todoList for now, but make sure to update the connection string.

**Important: The key step is updating the MongoDB connection string; the database name is secondary at this stage.**

Here’s a table to help you understand the required variables:

| Key                     | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| MONGO_CONNECTION_STRING | The MongoDB connection string.                           |
| MONGO_CONNECTION_STRING | The name of your MongoDB database `(default: todoList)`. |

### Running the Project

Once your environment variables are set up, you can start the project in development mode by running:

```bash
npm run start
```
