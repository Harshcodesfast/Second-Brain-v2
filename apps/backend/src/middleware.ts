import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];
  const decoded = Jwt.verify(header as string, JWT_PASSWORD);
  if (decoded) {
    if (typeof decoded === "string") {
      res.status(403).json({ message: "please log in" });
    }
    req.userId = (decoded as JwtPayload).id;
    next();
  } else {
    res.status(403).json({ message: "please log in" });
  }
};
