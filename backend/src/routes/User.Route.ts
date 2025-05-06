import { RequestHandler, Router } from "express";
import UserController from "../controllers/User.Controller";
import { protectRouteMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../lib/multer";

const router = Router();

router.post(
  "/update-user",
  upload.single("profilePic"),
  protectRouteMiddleware,
  UserController.updateUser 
);

export default { router };
