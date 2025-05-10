import { model, Schema, Types } from "mongoose";

interface IDirectMessage {
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  content?: string;
  file_id?: Types.ObjectId;
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
      optional: true,
    },
    file_id: {
      type: Schema.Types.ObjectId,
      ref: "File",
      optional: true,
    },
  },
  { timestamps: true }
);

const DirectMessage = model<IDirectMessage>(
  "DirectMessage",
  DirectMessageSchema
);

export { DirectMessage, IDirectMessage };
