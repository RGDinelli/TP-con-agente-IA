//PUNTO 2

import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export const errorHandlerMiddleware = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(err);

  const status = err.status ?? 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({ message });
};