import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:3000",
            ],
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    console.log("⚡ Socket.io Real-Time Engine Initialized & Listening for KDS Events");

    io.on("connection", (socket) => {
        console.log(`🔌 [SOCKET.IO] Client Connected: ${socket.id}`);

        // Kitchen KDS Room for live orders
        socket.on("join-kitchen", () => {
            socket.join("kitchen-room");
            console.log(`👨‍🍳 [SOCKET.IO] Socket ${socket.id} joined 'kitchen-room'`);
        });

        // Customer Live Tracking Room
        socket.on("join-order-tracking", (orderId) => {
            socket.join(`order-${orderId}`);
            console.log(`🛵 [SOCKET.IO] Client ${socket.id} tracking Order: ${orderId}`);
        });

        socket.on("disconnect", (reason) => {
            console.log(`❌ [SOCKET.IO] Client Disconnected: ${socket.id} (Reason: ${reason})`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};