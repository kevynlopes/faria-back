import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";

export const UserController = {
  async index(request: Request, response: Response) {
    const users = await UserRepository.findAll();
    return response.json(users);
  },

  async show(request: Request, response: Response) {
    try {
    } catch (error) {
      console.log(error);
    }
  },

  async store(request: Request, response: Response) {
    const { name, email, password, role } = request.body;
    const user = await UserRepository.create({ name, email, password, role });

    return response.status(201).json(user);
  },

  async update() {
    try {
    } catch (error) {
      console.log(error);
    }
  },

  async destroy() {
    try {
    } catch (error) {
      console.log(error);
    }
  },
};
