import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";
import { generateToken } from "../utils/auth";

export const UserController = {
  async index(request: Request, response: Response) {
    const users = await UserRepository.findAll();
    return response.json(users);
  },

  async show(request: Request, response: Response) {
    try {
      const { email } = request.params;

      if (!email) {
        return response.status(400).json({ error: "Email é obrigatório" });
      }

      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }

      return response.status(200).json(user);
    } catch (error) {
      console.log(error);
    }
  },

  async store(request: Request, response: Response) {
    const { name, email, password, role } = request.body;
    const findByEmail = await UserRepository.findByEmail(email);

    if (findByEmail) {
      return response
        .status(409)
        .json({ error: "Email já existe na base de dados." });
    }

    const user = await UserRepository.create({ name, email, password, role });

    return response.status(201).json(user);
  },

  async update(request: Request, response: Response) {
    try {
      const { email: currentEmail } = request.params;
      const { name, email, password, role } = request.body;
      const requester = (request as any).user;

      const userExists = await UserRepository.findByEmail(currentEmail);
      if (!userExists) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }

      if (email !== currentEmail) {
        const emailTaken = await UserRepository.findByEmail(email);
        if (emailTaken) {
          return response.status(409).json({ error: "Email já está em uso" });
        }
      }

      if (role && requester.role !== "admin") {
        return response
          .status(403)
          .json({ error: "Apenas administradores podem alterar a role" });
      }

      const updatedUser = await UserRepository.updateByEmail(currentEmail, {
        name,
        email,
        password,
        role: requester.role === "admin" ? role : undefined, // só atualiza a role se for admin
      });

      const token = generateToken({
        id: updatedUser!.id,
        email: updatedUser!.email,
        role: updatedUser!.role,
      });

      return response.status(200).json({ user: updatedUser, token });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async delete(request: Request, response: Response) {
    try {
      const { email } = request.params;
      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return response.status(404).json({ error: "Usuario não encontrado" });
      }

      await UserRepository.delete(email);
      response.sendStatus(204);
    } catch (error) {
      console.log(error);
    }
  },
};
