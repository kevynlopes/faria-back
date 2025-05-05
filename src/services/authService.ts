import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma";
import { generateToken } from "../utils/auth";

const prisma = new PrismaClient();

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function registerUser(
  data: Omit<RegisterData, "role">
): Promise<string> {
  const { name, email, password } = data;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw { status: 409, message: "Usuário já existe" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return generateToken({ id: user.id, email: user.email, role: user.role });
}

export async function loginUser(data: LoginData): Promise<string> {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw { status: 401, message: "Senha inválida" };
  }

  return generateToken({ id: user.id, email: user.email, role: user.role });
}
