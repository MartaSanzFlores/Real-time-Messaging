import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null;

export const initIO = (httpServer: HttpServer): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });
    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
};
