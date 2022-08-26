import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  loginValidation,
  noteCreateValidation,
  registerValidation,
} from "./validations/validations.js";
import { handleValidationError } from "./utils/index.js";

import { UserController, NoteController } from "./controllers/index.js";
import checkAuth from "./utils/checkAuth.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDb
mongoose
  .connect(
    "mongodb+srv://admin:54321@cluster0.nlgep6u.mongodb.net/Notes?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log(err));

//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// --- Запросы ---

//Вход
app.post(
  "/auth/login",
  loginValidation,
  handleValidationError,
  UserController.login
);

app.get("/auth/me", checkAuth, UserController.getMe);

//Регистрация
app.post(
  "/auth/register",
  registerValidation,
  handleValidationError,
  UserController.register
);

//Получение всех заметок
app.get("/notes", NoteController.getAll);

//Получить одну заметку
app.get("/notes/:id", NoteController.getOne);

//Создать заметку
app.post(
  "/notes",
  checkAuth,
  noteCreateValidation,
  handleValidationError,
  NoteController.create
);

//Редактировать заметку
app.patch(
  "/notes/:id",
  checkAuth,
  noteCreateValidation,
  handleValidationError,
  NoteController.update
);

//Удалить заметку
app.delete("/notes/:id", checkAuth, NoteController.remove);

//Загрузить файл в статическую папку

app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось загрузить файл",
    });
  }
});

app.listen(3001, (err) => {
  if (err) console.log(err);
  console.log("Server is starting in 3001 port...");
});
