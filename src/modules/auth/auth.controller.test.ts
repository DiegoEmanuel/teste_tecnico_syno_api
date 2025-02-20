import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('../users/user.service', () => {
    return {
        UserService: jest.fn().mockImplementation(() => ({
            findUserByEmail: jest.fn()
        }))
    };
});

describe('AuthController', () => {
    let authController: AuthController;
    let mockUserService: jest.Mocked<UserService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
         
        jest.clearAllMocks();
        
        mockUserService = {
            findUserByEmail: jest.fn()
        } as any;

         
        authController = new AuthController(mockUserService);
        
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });

    describe('login', () => {
        it('deve retornar token quando credenciais são válidas', async () => {
            const mockUser = {
                id: '1',
                email: 'test@test.com',
                password: await bcrypt.hash('password123', 10),
                name: 'Test User'
            };

            mockRequest = {
                body: {
                    email: 'test@test.com',
                    password: 'password123'
                }
            };

            mockUserService.findUserByEmail = jest.fn().mockResolvedValue(mockUser);

            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).not.toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    niceJob: true,
                    token: expect.any(String),
                    user: expect.objectContaining({
                        id: mockUser.id,
                        email: mockUser.email,
                        name: mockUser.name
                    })
                })
            );
        });

        it('deve retornar erro quando email não existe', async () => {
            mockRequest = {
                body: {
                    email: 'nonexistent@test.com',
                    password: 'password123'
                }
            };

            mockUserService.findUserByEmail = jest.fn().mockResolvedValue(null);

            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Usuário não encontrado'
            });
        });

        it('deve retornar erro quando senha está incorreta', async () => {
            const mockUser = {
                id: '1',
                email: 'test@test.com',
                password: await bcrypt.hash('password123', 10),
                name: 'Test User'
            };

            mockRequest = {
                body: {
                    email: 'test@test.com',
                    password: 'wrongpassword'
                }
            };

            mockUserService.findUserByEmail = jest.fn().mockResolvedValue(mockUser);

            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Senha inválida'
            });
        });
    });

    describe('verifyToken', () => {
        it('deve passar para próximo middleware quando token é válido', () => {
            const token = jwt.sign({ userId: '1', email: 'test@test.com' }, process.env.JWT_SECRET || 'diegofalcao');
            
            mockRequest = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };

            authController.verifyToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
        });

        it('deve retornar erro quando token não é fornecido', () => {
            mockRequest = {
                headers: {}
            };

            authController.verifyToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Token não fornecido'
            });
        });

        it('deve retornar erro quando token é inválido', () => {
            mockRequest = {
                headers: {
                    authorization: 'Bearer invalid-token'
                }
            };

            authController.verifyToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Token inválido'
            });
        });
    });
});