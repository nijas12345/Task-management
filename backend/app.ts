import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT
const app: Application = express();
const ORIGIN = process.env.ORIGIN?.split(",")

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.post("/auth/login", (req: Request, res: Response) => {
  const { email,password, role } = req.body;
  console.log(email,password,role);
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
