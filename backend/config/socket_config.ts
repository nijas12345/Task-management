import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

dotenv.config();

const secret_key = process.env.JWT_SECRET || "default_secret";
const userTokenName = process.env.USER_ACCESS_TOKEN_NAME || "userToken";
const allowedOrigins = process.env.CORS_ORIGINS?.split(",");

const connectedUsers = new Map<string, string>();

let io: SocketServer;

const configSocketIO = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      console.log("cookie header:", cookieHeader);

      if (!cookieHeader) return next(new Error("No cookie header found"));

      const cookies = cookie.parse(cookieHeader);
      const token = cookies[userTokenName];

      if (!token) return next(new Error("No token found in cookies"));

      const decoded = jwt.verify(token, secret_key) as {
        user_id: string;
        role: string;
      };

      socket.data.user_id = decoded.user_id;
      socket.data.role = decoded.role;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user_id;

    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log("✅ User connected:", userId, "->", socket.id);
    }
    console.log(connectedUsers);

    socket.on("disconnect", () => {
      if (userId) {
        connectedUsers.delete(userId);
      }
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const sendNotificationToUser = (user_id: string, notificationData: any) => {
  const socketId = connectedUsers.get(user_id);

  if (socketId && io) {
    io.to(socketId).emit("notification", notificationData);
    console.log(`📩 Sent notification to ${user_id}:`, notificationData);
  } else {
    console.log(`⚠️ User ${user_id} not connected. Notification stored only.`);
  }
};

export { configSocketIO, io, connectedUsers, sendNotificationToUser };
