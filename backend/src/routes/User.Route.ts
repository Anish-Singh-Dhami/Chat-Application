import { Router } from "express";
import UserController from "../controllers/User.Controller";
import { protectRouteMiddleware } from "../middlewares/auth.middleware";
import { uploadDisk, uploadMemory } from "../lib/multer";
import { validFriendship } from "../middlewares/message.middleware";

const router = Router();

router.post(
  "/update",
  uploadMemory.single("profilePic"),
  protectRouteMiddleware,
  UserController.updateUser
);

router.get("/friends", protectRouteMiddleware, UserController.getFriends);

router.get(
  "/friends/:friendId",
  protectRouteMiddleware,
  validFriendship,
  UserController.getMessagesWithFriend
);

router.post(
  "/friends/:friendId",
  protectRouteMiddleware,
  validFriendship,
  // uploadDisk.single("file"), // TODO: File upload is not implemented yet
  UserController.sendMessageToFriend
);

export default { router };
