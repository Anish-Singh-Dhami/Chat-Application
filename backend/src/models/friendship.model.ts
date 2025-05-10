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
    },
  },
  { timestamps: true }
);

FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friendship = model<IFriendship>("Friendship", FriendshipSchema);

export { FriendshipStatus, IFriendship, Friendship };
