import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { configSocketIO } from "./config/socket_config";
import userRoute from "./routes/userRoute";
import databaseConnection from "./config/databaseConfig";
import "./jobs/dailyReminder";
dotenv.config();
databaseConnection();

const PORT = process.env.PORT || 8000;
const app: Application = express();
const allowedOrigins = process.env.CORS_ORIGINS?.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoute);

const server = createServer(app);

configSocketIO(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
