import { CreateProductDTO } from "./product.dto";
import { ProductRepository } from "./product.repository";
import { deleteImageFromFirebase } from '../../services/firebase';
import { ProductEntity } from '../../entities/product.entity';

export class ProductService {
  constructor(private productRepository: ProductRepository = new ProductRepository()) { }

  async createProduct(productDto: CreateProductDTO) {
    const codeAlredyExists = await this.productRepository.getProductByCodigo(productDto.codigo_produto);
    if (codeAlredyExists) {
      throw new Error("PRODUCT_DUPLICATE");
    }

    const product = new ProductEntity(productDto);
    return this.productRepository.createProduct(
      product.codigo_produto,
      product.descricao_produto,
      product.foto_produto
    );
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async updateProduct(id: string, data: Partial<CreateProductDTO>) {
    const currentProduct = await this.productRepository.getProductById(id);
    const updatedProduct = new ProductEntity({ ...currentProduct, ...data });

    if (currentProduct?.foto_produto && data.foto_produto && data.foto_produto !== currentProduct.foto_produto) {
      await deleteImageFromFirebase(currentProduct.foto_produto);
    }

    return this.productRepository.updateProduct(id, updatedProduct);
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
        throw error;
    }
  }
}
