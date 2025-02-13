import { ProductRepository } from "./product.repository";

export class ProductService {
  private productRepository = new ProductRepository();

  async createProduct(codigo_produto: string, descricao_produto: string, foto_produto?: string) {
    return this.productRepository.createProduct(codigo_produto, descricao_produto, foto_produto);
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async updateProduct(id: string, data: Product) {
    return this.productRepository.updateProduct(id, data);
  }

  async deleteProduct(id: string) {
    return this.productRepository.deleteProduct(id);
  }

  async getProductByCodigo(codigo_produto: string) {
    return this.productRepository.getProductByCodigo(codigo_produto);
  }
}

interface Product {
  codigo_produto: string;
  descricao_produto: string;
  foto_produto?: string;
}


