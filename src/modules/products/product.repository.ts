import prisma from "../../database";
import { ProductEntity } from "../../entities/product.entity";

export class ProductRepository {
  async createProduct(codigo_produto: string, descricao_produto: string, foto_produto?: string) {
     
    return prisma.produto.create({
      data: { codigo_produto, descricao_produto, status: true, foto_produto }
    });
  }

  async getAllProducts() {
    return prisma.produto.findMany({
      orderBy: {
        status: 'desc'
      }
    });
  }

  async updateProduct(id: string, data: ProductEntity) {
    return prisma.produto.update({ 
        where: { id }, 
        data 
    });
  }

  async deleteProduct(id: string) {
    return prisma.produto.delete({ where: { id } });
  }

  async getProductByCodigo(codigo_produto: string) {
    return prisma.produto.findUnique({ where: { codigo_produto } });
  }

  async getProductById(id: string) {
    return prisma.produto.findUnique({ where: { id } });
  }

  async deleteAllProducts() {
    return prisma.produto.deleteMany();
  }
}
