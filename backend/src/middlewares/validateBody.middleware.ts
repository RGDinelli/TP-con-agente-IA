//PUNTO 1

//Valida el body del register
import { Request, Response, NextFunction } from "express";

export const validateBodyMiddleware = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    //Valida los campos y si falta uno corta el proceso con un error
    for (const field of requiredFields) {
      if (!req.body?.[field]) {
        return res.status(400).json({ message: `El campo "${field}" es obligatorio` });
      }
    }
    next();
  };
};