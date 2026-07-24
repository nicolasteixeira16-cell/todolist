# TodoList Application

## Project Overview

This project was developed as part of the **Learning Campus** Frontend JavaScript training.

The goal was to create the **Frontend** of a task management application using **HTML**, **CSS**, and **JavaScript**, while consuming a REST API developed separately.

The application allows users to:

- Enter their first name
- Display a personalized task list
- Create new tasks
- View task details
- Mark tasks as completed
- Reopen completed tasks
- Delete tasks
- Display task statistics

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Fetch API
- LocalStorage

### Backend

- Node.js
- Express.js
- Swagger
- REST API
- Hosted on Vercel

---

## Project Structure

```
todolist/
│
├── backend-todolist/
│   ├── app.js
│   ├── package.json
│   └── vercel.json
│
├── frontend-todolist/
│   ├── index.html
│   ├── tasks.html
│   ├── detail.html
│   ├── statistics.html
│   ├── css/
│   └── js/
│
└── README.md
```

---

## Features

### Home Page

- First name input
- JavaScript form validation
- Stores the user's name in LocalStorage
- Redirects to the task list

### Task List

- Retrieves tasks from the backend API
- Displays all tasks
- Creates new tasks
- Opens task details

### Task Details

- View task information
- Mark as completed
- Reopen a task
- Delete a task

### Statistics

- Total number of tasks
- Completed tasks
- Pending tasks

---

## Live Demo

Frontend:

https://todolist-2m8d.vercel.app/

Backend API:

https://todolist-nu-two-35.vercel.app/todos

Swagger Documentation:

https://todolist-nu-two-35.vercel.app/api-docs

---

## Installation

Clone the repository:

```bash
git clone https://github.com/nicolasteixeira16-cell/todolist.git
```

Go to the frontend folder:

```bash
cd frontend-todolist
```

Open:

```
index.html
```

or use Live Server.

---

## Author

**Nicolas Teixeira**

Learning Campus – Frontend JavaScript Project
