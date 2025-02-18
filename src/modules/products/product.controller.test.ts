import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Request, Response } from 'express';
import { ProductEntity } from '../../entities/product.entity';

// Mock do ProductService
jest.mock('./product.service');

describe('ProductController', () => {
    let productController: ProductController;
    let mockProductService: jest.Mocked<ProductService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Configurar o mock do ProductService
        mockProductService = new ProductService() as jest.Mocked<ProductService>;
        
        productController = new ProductController(mockProductService);
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('createProduct', () => {
        it('deve criar um produto com sucesso', async () => {
            const mockProduct = new ProductEntity({
                id: '1',
                codigo_produto: 'PROD001',
                descricao_produto: 'Produto Teste',
                status: true,
                foto_produto: 'url-da-foto'
            });

            mockRequest = {
                body: {
                    codigo_produto: 'PROD001',
                    descricao_produto: 'Produto Teste'
                },
                file: {
                    fieldname: 'foto_produto',
                    originalname: 'test.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    destination: './uploads',
                    filename: 'test.jpg',
                    path: '/uploads/test.jpg',
                    size: 1234,
                    buffer: Buffer.from([]),
                    stream: {} as any,
                    url: 'url-da-foto'
                }
            };

            mockProductService.createProduct.mockResolvedValue(mockProduct as any);

            await productController.createProduct(
                mockRequest as any,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
        });

        it('deve retornar erro quando produto já existe', async () => {
            mockRequest = {
                body: {
                    codigo_produto: 'PROD001',
                    descricao_produto: 'Produto Teste'
                }
            };

            mockProductService.createProduct.mockRejectedValue(new Error('PRODUCT_DUPLICATE'));

            await productController.createProduct(
                mockRequest as any,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getAllProducts', () => {
        it('deve retornar lista de produtos', async () => {
            const mockProducts = [
                new ProductEntity({
                    id: '1',
                    codigo_produto: 'PROD001',
                    descricao_produto: 'Produto 1',
                    status: true,
                    foto_produto: 'url1'
                }),
                new ProductEntity({
                    id: '2',
                    codigo_produto: 'PROD002',
                    descricao_produto: 'Produto 2',
                    status: true,
                    foto_produto: 'url2'
                })
            ];

            mockProductService.getAllProducts.mockResolvedValue(mockProducts as any);

            await productController.getAllProducts(
                {} as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
        });
    });

    describe('updateProduct', () => {
        it('deve atualizar produto com sucesso', async () => {
            const mockProduct = new ProductEntity({
                id: '1',
                codigo_produto: 'PROD001',
                descricao_produto: 'Produto Atualizado',
                status: true,
                foto_produto: 'url-da-foto'
            });

            mockRequest = {
                params: { id: '1' },
                body: { descricao_produto: 'Produto Atualizado' }
            };

            mockProductService.getProductById.mockResolvedValue(mockProduct as any);
            mockProductService.updateProduct.mockResolvedValue(mockProduct as any);

            await productController.updateProduct(
                mockRequest as any,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('deleteProduct', () => {
        it('deve deletar produto com sucesso', async () => {
            const mockProduct = new ProductEntity({
                id: '1',
                codigo_produto: 'PROD001',
                descricao_produto: 'Produto Teste',
                status: true,
                foto_produto: 'url-da-foto'
            });

            mockRequest = {
                params: { id: '1' }
            };

            mockProductService.getProductById.mockResolvedValue(mockProduct as any);

            await productController.deleteProduct(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Produto e imagem deletados com sucesso"
            });
        });
    });
}); 