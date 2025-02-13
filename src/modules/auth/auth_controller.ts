import { NextFunction, Request, Response } from "express";
import { UserService } from "../users/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './dtos/login.dto';

const secret = process.env.JWT_SECRET || 'diegofalcao';
config();


export interface AuthenticatedRequest extends Request {
    user?: any;
}

const userService = new UserService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const loginDto = plainToClass(LoginDto, req.body);
            const errors = await validate(loginDto);

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

            const { email, password } = loginDto;
            const user = await userService.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ message: "Usuário não encontrado" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: "Senha inválida" });
            }

            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email 
                }, 
                secret,
                { expiresIn: "1h" }
            );

            return res.json({ 
                niceJob: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return res.status(500).json({ message: "Erro ao fazer login" });
        }
    }
    

    async verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
    
        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido" });
        }
    
        const token = authHeader.replace('Bearer ', '');
         //de forma simples a função jwt.verify verifica se o token é valido e se é valido ele retorna o id e o email do usuario
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token inválido" });
            }
    
            req.user = decoded; 
            next();
        });
   
    }
    

}



