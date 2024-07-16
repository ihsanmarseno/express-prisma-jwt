import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, email: user.email },
    process.env.SECRET_KEY!,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    name: user.username,
    email: user.email,
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }

  try {
    const hashingPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const user = await prisma.users.create({
      data: {
        user_id: id,
        username,
        email,
        password: hashingPassword,
      },
    });

    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
