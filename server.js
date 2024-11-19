import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

//routers
import AuthRouter from "./routes/authRouter.js";
import PostRouter from "./routes/postRouter.js";
import UserRouter from "./routes/userRouter.js";
import QaSectionRouter from "./routes/qaRouter.js";
import ArticleRouter from "./routes/articleRouter.js";

//public
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//middleware
import errorHandlerMiddleware from "./middleware/errorhandlerMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/qa-section", QaSectionRouter);
app.use("/api/v1/articles", ArticleRouter);

//not found
app.use("*", (req, res) => {
  res.status(404).json({ msg: "route not found " });
});

//err HANDLING  middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server listening on ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
