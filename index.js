import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validation.js";
import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { getLastTags } from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://kabalesha:Ax300305@clustermern.uin4gkd.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB is Okay"))
  .catch((error) => console.log("DB error", error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("OK");
});
