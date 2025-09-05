import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorMiddleWare } from "./middleware/error.middleware.js";


import userRouter from "./routes/user.route.js"
import { unverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.FRONTEND_URL 
      : "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user",userRouter);

app.get("/", (req, res) => {
  res.send("Server is running....");
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT : ${PORT}`);
  unverifiedAccounts()
  connectDB();
});

app.use(errorMiddleWare)