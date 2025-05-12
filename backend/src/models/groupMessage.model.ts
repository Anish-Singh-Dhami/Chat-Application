import { model, Schema, Types } from "mongoose";

interface IGroupMessage {
  sender_id: Types.ObjectId;
  group_id: Types.ObjectId;
  content?: string;
  file_id?: Types.ObjectId;
}

const GroupMessageSchema = new Schema<IGroupMessage>(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    content: {
      type: String,
    },
    file_id: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  },
  { timestamps: true }
);

const GroupMessage = model<IGroupMessage>("GroupMessage", GroupMessageSchema);

export { IGroupMessage, GroupMessage };
