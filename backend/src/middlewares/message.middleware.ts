import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { getSortedUserIds } from "../lib/utils";
import { Friendship, FriendshipStatus } from "../models/friendship.model";

const validFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { friendId } = req.params;
  const loggedInUserId = req.user?._id;

  if (!loggedInUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!friendId || !Types.ObjectId.isValid(friendId)) {
    res.status(400).json({ message: "Friend ID is invalid" });
    return;
  }

  const [user1_id, user2_id] = getSortedUserIds(
    friendId,
    loggedInUserId.toString()
  );

  const friendship = await Friendship.findOne({
    user1_id,
    user2_id,
    status: FriendshipStatus.ACCEPTED,
  });

  if (!friendship) {
    res
      .status(403)
      .json({ message: "Access Denied! You're not friends with this user." });
    return;
  }
  next();
};

export { validFriendship };
