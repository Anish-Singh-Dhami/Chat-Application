import { Schema, Types, model } from "mongoose";

enum FriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  BLOCKED = "blocked",
  REJECTED = "rejected",
}

interface IFriendship {
  user1_id: Types.ObjectId; // Smaller User ID
  user2_id: Types.ObjectId; // Larger User ID
  action_by: Types.ObjectId; // Last user who updated the status
  status: FriendshipStatus;
  lastMessageId: Types.ObjectId; // Id of the last message sent in the friendship
  lastMessageAt: Date; // Last message sent in the friendship
}

const FriendshipSchema = new Schema<IFriendship>(
  {
    user1_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FriendshipStatus),
      default: FriendshipStatus.PENDING,
      required: true,
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "DirectMessage",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

FriendshipSchema.index({ user1_id: 1, user2_id: 1 }, { unique: true });

const Friendship = model<IFriendship>("Friendship", FriendshipSchema);

export { FriendshipStatus, IFriendship, Friendship };
