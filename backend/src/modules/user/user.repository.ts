import { AppDataSource } from "../../database/data-source.js";
import { User } from "./user.entity.js";


const repo = () => AppDataSource.getRepository(User);


export const findByEmail = async (email: string) =>
  repo().findOneBy({ email });

export const findAll = async () =>
  repo().find({
    select: {
      id: true,
      nombre: true,
      email: true,
      creadoEn: true,
    },
  });


export const createUser = async (data: Partial<User>) =>
  repo().save(repo().create(data));
