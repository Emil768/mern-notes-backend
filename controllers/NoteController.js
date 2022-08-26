import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import NoteModel from "../models/Note.js";

export const getAll = async (req, res) => {
  try {
    const notes = await NoteModel.find().populate("user").exec();

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: "Заметки не найдены",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    NoteModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          res.status(500).json({
            message: "Не удалось вернуть пост",
          });
        }

        if (!doc) {
          console.log(doc);
          return res.status(500).json({
            message: "Пост не найден",
          });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    res.status(500).json({
      message: "Не удалось создать заметку",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new NoteModel({
      title: req.body.title,
      text: req.body.text,
      category: req.body.category,
      user: req.userId,
    });

    const note = await doc.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось создать заметку",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await NoteModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        user: req.userId,
      }
    );

    res.json({
      message: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось создать заметку",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    NoteModel.findByIdAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          res.status(500).json({
            message: "Не удалось удалить заметку",
          });
        }

        if (!doc) {
          console.log(doc);
          return res.status(500).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Не удалось удалить заметку",
    });
  }
};
