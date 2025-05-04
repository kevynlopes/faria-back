import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma";

export default {
  async findAll() {
    return await prisma.user.findMany();
  },

  async create(data: Prisma.UserCreateInput) {
    try {
      const user = await prisma.user.create({
        data,
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  },
};
