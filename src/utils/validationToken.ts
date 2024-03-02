import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  user_id: string;
  username: string;
  email: string;
}

interface CustomRequest extends Request {
  payload?: Payload;
}

const validationToken: RequestHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as Payload;
    req.payload = decoded;
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default validationToken;
