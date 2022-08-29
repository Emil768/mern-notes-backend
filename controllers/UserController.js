import bcrypt from "bcrypt";
import formidable from "formidable";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

export const login = async (req, res) => {
  try {
    //Проверка по e-mail
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }

    //Проверка по паролю
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      res.status(404).json({
        message: " Неверный логин или пароль",
      });
    }

    //Токен для проверки
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const register = async (req, res) => {
  try {
    //Шифрование пароля
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: {
        public_id: req.body.avatarUrl.public_id,
        url: req.body.avatarUrl.url,
      },
    });

    const user = await doc.save();

    //Токен для проверки
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const uploads = (req, res) => {
  console.log(req.body);
  try {
    const form = formidable();
    form.parse(req, async (err, field, file) => {
      const response = await cloudinary.uploader.upload(file.image.filepath);
      res.json(response);
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось загрузить файл",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
