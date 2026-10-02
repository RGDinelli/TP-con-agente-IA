import { Request, Response } from "express";
import * as userService from "./user.service.js";


export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await userService.register(nombre, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await userService.listUsers();
  res.status(200).json(users);
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
   
    const result = await userService.login(email, password);
   
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
