import jwt from "jsonwebtoken";
import { User } from "../generated/prisma";

const secret = process.env.JWT_SECRET || "default_secret";

export function generateToken(user: Pick<User, "id" | "email" | "role">) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as jwt.SignOptions);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
}
