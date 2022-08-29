import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import {
  loginValidation,
  noteCreateValidation,
  registerValidation,
} from "./validations/validations.js";
import { handleValidationError, checkAuth } from "./utils/index.js";

import { UserController, NoteController } from "./controllers/index.js";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDb
mongoose
  .connect(
    "mongodb+srv://admin:54321@cluster0.nlgep6u.mongodb.net/Notes?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log(err));

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

//Заметки по категориям
app.get("/category/:name", NoteController.getCategory);

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
app.post("/uploads", UserController.uploads);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) console.log(err);
  console.log("Server is starting in 4444 port...");
});
