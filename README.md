
=======
# Book Tracker

**Book Tracker** is a full-stack application that allows users to track the books they are reading. It provides features for managing books, adding notes, updating book information, and tracking reading progress. The application consists of both a frontend and a backend.

This project was built using **Bun** and **Elysia.js** for the backend, and **React** for the frontend.

---

## Features

### Backend
- Built with **Elysia.js** and **Bun**.
- RESTful API for managing books and notes.
- Supports operations like adding, updating, deleting, and retrieving books and notes.
- Uses a **PostgreSQL** database to store data.
- Cloudinary integration for image uploads.

### Frontend
- Built with **React**.
- Allows users to view books, add new books, and manage notes.
- Provides an interface to mark reading progress and manage book details.

---

## Installation

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/MohammedNifli/booktracker-backend.git

2.Navigate into the project folder:
cd booktracker-backend

3.Install dependencies:
Install the required dependencies using Bun:

bun install

4.Set up environment variables:

Create a .env file at the root of the backend project and add your environment variables.
Example .env configuration:

DATABASE_URL=postgresql://postgres:<Password>@localhost:5432/booktracker

PORT=4000

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

> Replace <Password> with your actual database password.

> Add your Cloudinary credentials to enable image uploading.

5.Run the backend:

Start the backend server:

bun src/index.ts





>>>>>>> 105975e865bbb602c6f7bd4c698579942934de84
