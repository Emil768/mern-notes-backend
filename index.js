import express from "express";
import mongoose from "mongoose";

import NoteModel from "./models/Note.js";
import UserModel from "./models/User.js";

const app = express();

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:54321@cluster0.nlgep6u.mongodb.net/Notes?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log(err));

//Вход

app.post("/login", async (req, res) => {
  try {
    //Проверка по e-mail
    const user = new UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
});

//Регистрация

app.post("/register", async (req, res) => {
  try {
    //Шифрование пароля
    const password = req.body.password;
  } catch (err) {
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

//Создать заметку
app.post("/notes", async (req, res) => {
  try {
    const doc = new NoteModel({
      title: req.body.title,
      text: req.body.text,
      category: req.body.category,
    });

    const note = await doc.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось создать заметку",
    });
  }
});

//Получение всех постов
app.get("/notes", async (req, res) => {
  try {
    const notes = await NoteModel.find();

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: "Заметки не найдены",
    });
  }
});

app.listen(3001, (err) => {
  if (err) console.log(err);
  console.log("Server is starting in 3001 port...");
});
