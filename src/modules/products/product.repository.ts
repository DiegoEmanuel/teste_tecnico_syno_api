import prisma from "../../database";

export class ProductRepository {
  async createProduct(codigo_produto: string, descricao_produto: string, foto_produto?: string) {
    //criando com status sempre true 
    return prisma.produto.create({
      data: { codigo_produto, descricao_produto, status: true, foto_produto }
    });
  }

  async getAllProducts() {
    return prisma.produto.findMany();
  }

  async updateProduct(id: string, data: Product) {
    return prisma.produto.update({ where: { id }, data });
  }

  async deleteProduct(id: string) {
    return prisma.produto.delete({ where: { id } });
  }

  async getProductByCodigo(codigo_produto: string) {
    return prisma.produto.findUnique({ where: { codigo_produto } });
  }
}
interface Product {
  codigo_produto: string;
  descricao_produto: string;
  foto_produto?: string;
}

