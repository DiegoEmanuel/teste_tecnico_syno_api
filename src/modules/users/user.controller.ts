import { Request, Response } from "express";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dtos/create-user.dto';
const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const createUserDto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(createUserDto);

      if (errors.length > 0) {
        const validationErrors = errors.map(error => ({
          property: error.property,
          constraints: error.constraints
        }));
        return res.status(400).json({ 
          message: 'Erro de validação',
          errors: validationErrors 
        });
      }

      const { name, email, password } = createUserDto;
      
      const userExists = await userService.findUserByEmail(email);

      if(userExists){
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userService.createUser(name, email, hashedPassword);
      res.status(201).json(user);
    } catch (error) {
        console.log(error);
      res.status(400).json({ message: "Erro ao criar usuário" });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.json(users);
  }

  async updateUser(req: Request, res: Response){
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await userService.updateUser(id, { name, email, password });
    res.json(user);
  }

  async deleteUser(req: Request, res: Response){
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    res.json(user);
  }

  async deleteAllUsers(req: Request, res: Response){
    const users = await userService.deleteAllUsers();
    res.json(users);
  }
}
