// FILE: src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ msg: "No token provided." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ msg: "Failed to authenticate token." });
      return;
    }
    req.user = decoded;
    console.log("req.user:", req.user); // Log per verificare se req.user è definito
    next();
  });
};
