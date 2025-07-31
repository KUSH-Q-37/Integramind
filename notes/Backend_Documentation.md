# Task Management API

This project is a Flask-based API that allows users to manage tasks and users, leveraging MongoDB as the database. The API provides features such as updating task priorities, retrieving tasks, and associating users with their assigned tasks.

## Features

- **Task Priority Management**: Update the priority of tasks using simple API requests.
- **User and Task Association**: Retrieve all users along with their assigned tasks using MongoDB's aggregation pipeline.
- **Task Status Update**: Update the status of individual tasks (e.g., In Progress, Completed).
- **Retrieve All Tasks**: Fetch all tasks along with details like assigned user, status, and priority.

## Working

1. **Task Management**: The API supports the creation, retrieval, and modification of tasks. Tasks can have fields such as title, description, priority, status, due date, and assigned user.
2. **User Integration**: Users are stored in a separate collection and can be associated with tasks. You can fetch tasks assigned to specific users using aggregation.
3. **Database Operations**: MongoDB is used to store tasks and user information, with efficient querying via PyMongo.
4. **Error Handling**: The API includes error handling for missing data, non-existent tasks, and invalid request formats.

## Technologies Used

- **Flask**: A lightweight Python web framework used to create the API.
- **Flask-CORS**: Used to handle Cross-Origin Resource Sharing (CORS) to allow requests from different origins.
- **MongoDB**: NoSQL database used for storing tasks and users.
- **PyMongo**: MongoDB driver for Python, used for connecting to the MongoDB database.
- **BSON ObjectId**: For managing MongoDB document IDs.

## How It Works

1. **Routing**: The API exposes endpoints for task management and user-task interactions. For example, updating task priority or fetching all users with their tasks.
2. **MongoDB Queries**: Aggregation pipelines and update queries are used to efficiently retrieve and modify data in the database.
3. **JSON-based Responses**: All responses are in JSON format, ensuring easy integration with frontend applications or other services.
4. **Cross-Origin Access**: CORS is enabled to allow the API to be accessed from different domains.

## Deployment and Setup

- Flask application runs on a local server, typically on port `5000`.
- MongoDB is required to be running locally or in a cloud service like MongoDB Atlas.
