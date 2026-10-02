import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import * as userRepository from "./user.repository.js";


export const register = async (nombre: string, email: string, password: string) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new Error("El usuario ya existe");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({ nombre, email, passwordHash });

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    creadoEn: user.creadoEn,
  };
};

export const listUsers = async () => {
  const users = await userRepository.findAll();
  return users.map(({ id, nombre, email, creadoEn }) => ({
    id,
    nombre,
    email,
    creadoEn,
  }));
};

export const login = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Credenciales inválidas");
  }

  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("La autenticación no está configurada");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN?.trim() || "1h") as SignOptions["expiresIn"];
  const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn });

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      creadoEn: user.creadoEn,
    },
  };
};
