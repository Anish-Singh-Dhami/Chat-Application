import { Request, RequestHandler, Response, Router } from "express";
import AuthController from "../controllers/Auth.Controller";
import {
  emailValidator,
  fullNameValidator,
  handleValidationError,
  passwordValidator,
} from "../middlewares/validators.middleware";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.send("Auth route is working!");
});

router.post(
  "/signup",
  fullNameValidator,
  emailValidator,
  passwordValidator,
  handleValidationError as RequestHandler,
  AuthController.signup as RequestHandler
);

router.post(
  "/login",
  emailValidator,
  handleValidationError as RequestHandler,
  AuthController.login as RequestHandler
);

router.post("/logout", AuthController.logout as RequestHandler);

export default { router };
