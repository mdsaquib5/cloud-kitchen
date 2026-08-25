import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./configs/db.js";
import { initSocket } from "./configs/socket.js";

dotenv.config();

// 1. Connect Database
connectDB();

// 2. Create HTTP Server
const server = http.createServer(app);

// 3. Initialize Modular Socket.io
const io = initSocket(server);

// 4. Attach Socket instance to Express req.io
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`🔥 Kitchen Server running on http://localhost:${PORT}`);
});