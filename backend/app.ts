require("dotenv").config();
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController"

import userRouter from "./routes/userRouter";
import accountRouter from "./routes/accountRouter";
import blogRouter from "./routes/blogRouter";

const app = express();

app.enable("trust-proxy");

// Access-Control-Allow-Origin
app.use(cors());
app.options("*", cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/blog", blogRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
