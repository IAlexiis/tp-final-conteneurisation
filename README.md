# Task Manager App

## Prerequisites
- Docker
- Docker Compose

## Run the application
1. Build and start the containers:
   docker-compose up --build
2. Access the app at: http://localhost

## API Endpoints
- GET /tasks -> List all tasks
- POST /tasks { "title": "Task name" } -> Create a new task

## Database
- MySQL is used as the database
- Credentials:
  - User: user
  - Password: password
  - DB: taskdb
- Data is persisted in a Docker volume `db_data`
