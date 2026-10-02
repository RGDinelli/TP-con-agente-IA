import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";


@Entity("usuarios")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column({ type: "varchar"})
  nombre!: string;


  @Column({ type: "varchar", unique: true })
  email!: string;


  @Column({type: "varchar"})
  passwordHash!: string;


  @CreateDateColumn()
  creadoEn!: Date;
}
