import { Request, Response } from "express";
import {
  deleteImageFromCloudinary,
  uploadToCloudinary,
} from "../lib/cloudinary";
import { IUser, User } from "../models/user.model";
import { Types } from "mongoose";

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

export default { updateUser };
