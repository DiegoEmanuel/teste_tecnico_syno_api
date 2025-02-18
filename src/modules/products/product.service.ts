import { CreateProductDTO } from "./product.dto";
import { ProductRepository } from "./product.repository";

export class ProductService {
  constructor(private productRepository: ProductRepository = new ProductRepository()) { }

  async createProduct(productDto: CreateProductDTO) {

    const productExists = await this.productRepository.getProductByCodigo(productDto.codigo_produto);
    if (productExists) {
      throw new Error("PRODUCT_DUPLICATE");
    }


    return this.productRepository.createProduct(
      productDto.codigo_produto,
      productDto.descricao_produto,
      productDto.foto_produto || null
    );
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async updateProduct(id: string, data: Partial<CreateProductDTO>) {
    return this.productRepository.updateProduct(id, data);
  }

  async deleteProduct(id: string) {
    return this.productRepository.deleteProduct(id);
  }

  async getProductByCodigo(codigo_produto: string) {
    return this.productRepository.getProductByCodigo(codigo_produto);
  }

  async getProductById(id: string) {
    return this.productRepository.getProductById(id);
  }

  async deleteAllProducts() {
    return this.productRepository.deleteAllProducts();
  }
}
