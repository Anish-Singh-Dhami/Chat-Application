import { Request, Response } from "express";
import {
  deleteImageFromCloudinary,
  uploadToCloudinary,
} from "../lib/cloudinary";
import { IUser, User } from "../models/user.model";
import mongoose, { Types } from "mongoose";
import {
  Friendship,
  FriendshipStatus,
  IFriendship,
} from "../models/friendship.model";
import {
  DirectMessage,
  IDirectMessage,
  MessageStatus,
} from "../models/directMessage.model";
import { getSortedUserIds } from "../lib/utils";

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Profile picture is required" });
      return;
    }
    const user: IUser | undefined = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const userId: Types.ObjectId = user._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const oldProfilePic = user.profilePic;
    const uploadResponse = await uploadToCloudinary(req.file);
    await deleteImageFromCloudinary(oldProfilePic);
    if (!uploadResponse) {
      res.status(500).json({ message: "Failed to upload image" });
      return;
    }
    const imageUrl = uploadResponse.secure_url;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUserId = req.user?._id;
    if (!loggedInUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // query params
    const { cursorId: lastMessageId, cursorCreatedAt: lastMessageAt } =
      req.query;

    if (
      (lastMessageId && !Types.ObjectId.isValid(lastMessageId as string)) ||
      (lastMessageAt && isNaN(Date.parse(lastMessageAt as string)))
    ) {
      res.status(400).json({ message: "Invalid cursor parameters" });
      return;
    }
    // All Accepted friendships where the logged in user is either user1 or user2
    const baseQuery = [
      {
        user1_id: loggedInUserId,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        user2_id: loggedInUserId,
        status: FriendshipStatus.ACCEPTED,
      },
    ];

    // Cursor based pagination query, filter based on updatedAt and resolve ties using _id
    const cursorQuery =
      lastMessageId && lastMessageAt
        ? [
            {
              lastMessageAt: { $lt: new Date(lastMessageAt as string) },
            },
            {
              lastMessageAt: new Date(lastMessageAt as string),
              _id: { $lt: new Types.ObjectId(lastMessageId as string) },
            },
          ]
        : null;

    const query = {
      $and: [
        {
          $or: baseQuery,
        },
        ...(cursorQuery ? [{ $or: cursorQuery }] : []),
      ],
    };
    const limit = parseInt(req.query.limit as string) || 10;

    const friendship: IFriendship[] = await Friendship.find(query)
      .sort({ lastMessageAt: -1, lastMessageId: -1 }) // sort by updatedAt and then by _id
      .limit(limit + 1) // fetch one extra document to check if there are more results
      .lean();

    const hasMore = friendship.length > limit;

    const slicedFriendship = hasMore ? friendship.slice(0, limit) : friendship;
    const friendIds = slicedFriendship.map(({ user1_id, user2_id }) => {
      return user1_id.toString() === loggedInUserId.toString()
        ? user2_id.toString()
        : user1_id.toString();
    });

    // Fetch friends details
    const friendsDetails = await User.find({
      _id: { $in: friendIds },
    });

    // fetch unread message count for each friend
    const unreadMessageCounts = await DirectMessage.aggregate([
      {
        $match: {
          receiver_id: loggedInUserId,
          status: MessageStatus.UNREAD,
          sender_id: { $in: friendIds },
        },
      },
      {
        $group: {
          _id: "$sender_id",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert array of key:friendIds, value:unread-message-count into a map of object,
    // Mapping friendIds with unread message counts => O(1) lookup
    const unreadMessageCountMap = Object.fromEntries(
      unreadMessageCounts.map((message) => [
        message._id.toString(),
        message.count,
      ])
    );

    const result = friendsDetails.map((friend) => {
      const unreadCount = unreadMessageCountMap[friend._id.toString()] || 0;
      return {
        ...friend,
        unreadCount,
      };
    });

    res.status(200).json({
      friends: result,
      hasMore,
      nextCursor: hasMore
        ? {
            cursorId: friendship[limit - 1].lastMessageId,
            cursorCreatedAt: friendship[limit - 1].lastMessageAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getMessagesWithFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loggedInUserId = req.user?._id!;
    const { friendId } = req.params;
    const { cursorId: lastMessageId, cursorCreatedAt: lastMessageAt } =
      req.query;

    const [user1_id, user2_id] = getSortedUserIds(
      friendId,
      loggedInUserId.toString()
    );

    const baseQuery = [
      {
        sender_id: user1_id,
        receiver_id: user2_id,
      },
      {
        sender_id: user2_id,
        receiver_id: user1_id,
      },
    ];

    const cursorFilter =
      lastMessageId && lastMessageAt
        ? [
            {
              createdAt: { $lt: new Date(lastMessageAt as string) },
            },
            {
              createdAt: new Date(lastMessageAt as string),
              _id: { $lt: new Types.ObjectId(lastMessageId as string) },
            },
          ]
        : null;

    const query = {
      $and: [
        {
          $or: baseQuery,
        },
        ...(cursorFilter
          ? [
              {
                $or: cursorFilter,
              },
            ]
          : []),
      ],
    };

    const limit = parseInt(req.query.limit as string) || 20;

    const messages: IDirectMessage[] = await DirectMessage.find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1);

    const hasMore = messages.length > limit;
    const slicedMessages = hasMore ? messages.slice(0, limit) : messages;

    res.status(200).json({
      messages: slicedMessages,
      hasMore,
      nextCursor: hasMore
        ? {
            cursorId: messages[limit - 1]._id,
            cursorCreatedAt: messages[limit - 1].createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Error getting messages with friend:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const sendMessageToFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Transaction to ensure both operations are atomic
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const loggedInUserId = req.user?._id;
    if (!loggedInUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { friendId } = req.params;
    const { text } = req.body;
    const [newMessage] = await DirectMessage.create(
      [
        {
          sender_id: loggedInUserId,
          receiver_id: friendId,
          content: text,
          status: MessageStatus.UNREAD,
        },
      ],
      { session }
    );

    const [user1_id, user2_id] = getSortedUserIds(
      friendId,
      loggedInUserId.toString()
    );

    // Update the lastMessageId and lastMessageAt in the friendship collection
    await Friendship.updateOne(
      { user1_id, user2_id },
      {
        $set: {
          lastMessageId: newMessage._id,
          lastMessageAt: newMessage.createdAt,
        },
      },
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    // TODO: Emit the message to the receiver using socket.io

    res.status(200).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  updateUser,
  getFriends,
  getMessagesWithFriend,
  sendMessageToFriend,
};
