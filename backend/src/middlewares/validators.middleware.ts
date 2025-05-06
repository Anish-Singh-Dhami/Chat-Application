import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
      })),
    });
  }
  next();
};

const emailValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address"),
];

const passwordValidator = [
  body("password")
    .contains("")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),
];

const fullNameValidator = [
  body("fullName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
];

export {
  fullNameValidator,
  emailValidator,
  passwordValidator,
  handleValidationError,
};
