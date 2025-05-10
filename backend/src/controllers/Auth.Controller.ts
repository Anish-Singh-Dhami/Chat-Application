import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateJWT } from "../lib/utils";
import { User } from "../models/user.model";

const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    let user;
    try {
      user = await User.findOne({ email });
    } catch (error) {
      console.error("Error querying the database:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      console.error("Error hashing password:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (error) {
      console.error("Error saving user to the database:", error);
      return res.status(500).json({ message: "Failed to create user" });
    }

    newUser._id

    // Generate JWT and set cookie
    generateJWT({ userId: newUser._id.toString(), res });

    res.status(201).json({
      _id: newUser._id,
      fullName,
      email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error querying the database:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Check password
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Generate JWT and set cookie
    generateJWT({ userId: user._id.toString(), res });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const tokenName = process.env.TOKEN_NAME || "jwt";
    res.cookie(tokenName, "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default { signup, login, logout };
