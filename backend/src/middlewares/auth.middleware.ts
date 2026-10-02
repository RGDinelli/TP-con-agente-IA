import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    return res.status(500).json({ message: "La autenticación no está configurada" });
  }

  const authorization = req.headers.authorization;
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación" });
  }

  try {
    jwt.verify(token, secret);
    return next();
  } catch {
    return res.status(401).json({ message: "El token no es válido o ha expirado" });
  }
};