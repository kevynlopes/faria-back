import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma";
import { User } from "../lib/types";

export default {
  async findAll() {
    return await prisma.user.findMany();
  },

  async create(data: Prisma.UserCreateInput) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      console.error("Email não foi fornecido à função findByEmail!");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      ...user,
      role: user.role as "user" | "admin",
    };
  },

  async delete(email: string) {
    try {
      const user = await prisma.user.delete({
        where: { email },
      });

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async updateByEmail(email: string, data: Prisma.UserUpdateInput) {
    try {
      const updateData: Prisma.UserUpdateInput = { ...data };

      if (updateData.password && typeof updateData.password === "string") {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await prisma.user.update({
        where: { email },
        data: updateData,
      });

      return user;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return null;
    }
  },
};
