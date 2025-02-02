# ChatMore - A Secure Chat Application

## 📌 Project Description

ChatMore is a **MERN stack**-based real-time chat application that allows users to send encrypted messages securely. The platform supports **end-to-end encryption (E2EE)**, ensuring private communication. Users can send text, images, and videos, track online statuses, and manage conversations seamlessly.

## 🚀 Features

- **Real-time Chat** with WebSockets (Socket.io)
- **User Authentication** (JWT & Cookies-based sessions)
- **Online/Offline Status Tracking**
- **Message History & Seen Status**
- **Group and One-to-One Chat**
- **Profile Management**
- **Fully Responsive UI**

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT & Cookies
- **WebSockets:** Socket.io

## 📂 Folder Structure

```
📦 chatmore
├── 📁 backend (Node.js, Express, MongoDB)
│   ├── 📁 config (DB & environment setup)
│   ├── 📁 controllers (Business logic)
│   ├── 📁 models (Mongoose schemas)
│   ├── 📁 routes (API endpoints)
│   ├── 📁 middleware (Auth & encryption handling)
│   ├── 📁 helpers
│   ├── 📁 socket(includes socket.io logic)
│   ├── 📁 utils
│   ├── index.js (Main entry point)
│
├── 📁 frontend (React.js, Redux, Tailwind CSS)
│   ├── 📁 helpers
│   ├── 📁 redux
│   ├── 📁 src
│   │   ├── 📁 components
│   │   ├── 📁 pages
│   │   ├── 📁 assets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── package.json
│
├── 📄 .env (Environment variables)
├── 📄 README.md
```

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/darav321/ChatMore.git
cd ChatMore
```

### 2️⃣ Backend Setup

```sh
cd backend
npm install
```

Create a `.env` file inside `backend` and add:

```
MONGODB_URL = "mongodb+srv://varadkale20:ClnzfEF7fa7yxzrP@cluster0.j617z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

PORT=5000
```

Run the server:

```sh
npm start
```

### 3️⃣ Frontend Setup

```sh
cd frontend
npm install
```

Create a `.env` file inside `frontend` and add:

```
VITE_BACKEND_URL=http://localhost:5173
```

Run the frontend:

```sh
npm run dev
```

## 🔥 API Endpoints

### **Authentication**

- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login
- `POST /api/user/logout` - Logout user

### **Messages**

- `GET /api/messages/:conversationId` - Get messages from a conversation
- `POST /api/messages` - Send a new message
- `PATCH /api/messages/seen` - Mark messages as seen

### **Conversations**

- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Start a new conversation

## 🔌 WebSockets (Socket.io)

- **`connect`** - Establish a real-time connection
- **`message`** - Send & receive messages in real-time
- **`new-msg`** - Notify users about new messages
- **`seen`** - Mark messages as seen
- **`disconnect`** - Handle user disconnection

## 🤝 Contributing

1. Fork the project
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to your fork (`git push origin feature-name`)
5. Open a Pull Request

## 📜 License

This project is **MIT Licensed**. Feel free to use and modify it!

