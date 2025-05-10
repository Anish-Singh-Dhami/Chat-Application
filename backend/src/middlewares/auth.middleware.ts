import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

const protectRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tokenName = process.env.TOKEN_NAME || "jwt";

  try {
    const token = req.cookies[tokenName];
    if (!token) {
      console.error("Token not found in cookies");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const secretKey = process.env.JWT_SECRETE_KEY;
    if (!secretKey) {
      console.error("JWT secret key not define in environment variable");
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    if (!decoded) {
      console.error("Invalid token");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error("User not found");
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protected route middleware:", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export { protectRouteMiddleware };
