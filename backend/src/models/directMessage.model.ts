import { model, Schema, Types } from "mongoose";

enum MessageStatus {
  READ = "Read",
  UNREAD = "Unread",
}

interface IDirectMessage {
  _id: Types.ObjectId;
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  content?: string;
  file_id?: Types.ObjectId;
  status: MessageStatus;
  createdAt?: Date;
}

const DirectMessageSchema = new Schema<IDirectMessage>(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    file_id: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.UNREAD,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

const DirectMessage = model<IDirectMessage>(
  "DirectMessage",
  DirectMessageSchema
);

export { MessageStatus, DirectMessage, IDirectMessage };
