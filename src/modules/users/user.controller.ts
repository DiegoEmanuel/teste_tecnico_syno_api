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

      if (userExists) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userService.createUser(name, email, hashedPassword);
      //retorna o usuário criado sem a senha
      const userWithNoPass = {
        ...user,
        password: undefined
      };
      res.status(201).json(userWithNoPass);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Erro ao criar usuário" });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      //usando desestruturação para não retornar a senha
      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(usersWithoutPassword);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Erro ao buscar todos os usuários" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const user = await userService.updateUser(id, { name, email, password });
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Erro ao atualizar usuário" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {

      const { id } = req.params;

      const userExists = await userService.findUserById(id);
      if (!userExists) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      const user = await userService.deleteUser(id);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Erro ao deletar usuário", error: error.message });
    }
  }

  async deleteAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.deleteAllUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Erro ao deletar todos os usuários", error: error.message });
    }
  }
}
