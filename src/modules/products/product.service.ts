import { CreateProductDTO } from "./product.dto";
import { ProductRepository } from "./product.repository";
import { deleteImageFromFirebase } from '../../services/firebase';

export class ProductService {
  constructor(private productRepository: ProductRepository = new ProductRepository()) { }

  async createProduct(productDto: CreateProductDTO) {

    const codeAlredyExists = await this.productRepository.getProductByCodigo(productDto.codigo_produto);
    if (codeAlredyExists) {
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
    try {
      const currentProduct = await this.productRepository.getProductById(id);
      
      // Se está atualizando a imagem, deleta a antiga
      if (currentProduct?.foto_produto && data.foto_produto && data.foto_produto !== currentProduct.foto_produto) {
        await deleteImageFromFirebase(currentProduct.foto_produto);
      }

      return this.productRepository.updateProduct(id, data);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      // Busca o produto para obter a URL da imagem
      const product = await this.productRepository.getProductById(id);
      
      if (product?.foto_produto) {
        // Deleta a imagem do Firebase
        await deleteImageFromFirebase(product.foto_produto);
      }

      // Deleta o produto do banco
      await this.productRepository.deleteProduct(id);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  async getProductByCodigo(codigo_produto: string) {
    return this.productRepository.getProductByCodigo(codigo_produto);
  }

  async getProductById(id: string) {
    return this.productRepository.getProductById(id);
  }

  async deleteAllProducts() {
    try {
      // Busca todos os produtos para deletar suas imagens
      const products = await this.productRepository.getAllProducts();
      
      // Deleta todas as imagens do Firebase
      await Promise.all(
        products
          .filter(product => product.foto_produto)
          .map(product => deleteImageFromFirebase(product.foto_produto))
      );

      // Deleta todos os produtos do banco
      await this.productRepository.deleteAllProducts();
    } catch (error) {
      console.error('Erro ao deletar todos os produtos:', error);
      throw error;
    }
  }

  async deleteProductImage(id: string) {
    try {
        const product = await this.productRepository.getProductById(id);
        
        if (product?.foto_produto) {
            // Deleta a imagem do Firebase
            await deleteImageFromFirebase(product.foto_produto);
            
            // Atualiza o produto removendo a referência da imagem
            await this.productRepository.updateProduct(id, { foto_produto: null });
        }
    } catch (error) {
        console.error('Erro ao deletar imagem do produto:', error);
        throw error;
    }
  }
}
