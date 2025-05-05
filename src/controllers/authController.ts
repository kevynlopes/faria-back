import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const token = await authService.registerUser({
      name,
      email,
      password,
    });
    return res.status(201).json({ token });
  } catch (error: any) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser({ email, password });
    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}
