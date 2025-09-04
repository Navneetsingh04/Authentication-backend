import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorMiddleWare } from "./middleware/error.middleware.js";


import userRouter from "./routes/user.route.js"

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user",userRouter);

app.listen(PORT, () => {
  console.log(`Server is Running on PORT : ${PORT}`);
  connectDB();
});

app.use(errorMiddleWare)