import { model, Schema, Types } from "mongoose";

enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  AWAY = "away",
}

interface IUser {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profilePic: string;
  bio?: string;
  status: UserStatus;
}

const UserSchema = new Schema<IUser>(
  {

    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.OFFLINE,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export { UserStatus, IUser, User };
