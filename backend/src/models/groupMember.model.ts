import { model, Schema, Types } from "mongoose";

enum GroupRole {
  ADMIN = "admin",
  MEMBER = "member",
  MODERATOR = "moderator",
}

interface IGroupMember {
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  role: GroupRole;
  isBlocked: boolean;
}

const GroupMemberSchema = new Schema<IGroupMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(GroupRole),
      default: GroupRole.MEMBER,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const GroupMember = model<IGroupMember>("GroupMember", GroupMemberSchema);

export { GroupRole, IGroupMember, GroupMember };
