import { model, Schema, Types } from "mongoose";

interface IGroup {
  name: string;
  description?: string;
  admin: Types.ObjectId;
  group_pic?: string;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group_pic: {
      types: String,
    }
  },
  { timestamps: true }
);

const Group = model<IGroup>("Group", GroupSchema);

export { IGroup, Group };
