import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route imports
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export default app;
