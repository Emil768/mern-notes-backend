import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const registerValidation = [
  body("fullName").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("avatarUrl").optional().isURL(),
];

export const noteCreateValidation = [
  body("title").isLength({ min: 3 }).isString(),
  body("text").isLength({ min: 10 }).isString(),
  body("category").optional().isString(),
];
