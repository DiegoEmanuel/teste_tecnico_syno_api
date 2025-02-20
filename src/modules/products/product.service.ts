import { ProductDTO } from "./dtos/product.dto";
import { ProductRepository } from "./product.repository";
import { deleteImage } from '../../services/handleLocalServerImage';
import { ProductEntity } from '../../entities/product.entity';

export class ProductService {
  constructor(private productRepository: ProductRepository = new ProductRepository()) { }

  async createProduct(productDto: ProductDTO) {
    const codeAlredyExists = await this.productRepository.getProductByCodigo(productDto.codigo_produto);
    if (codeAlredyExists) {
      throw new Error("Produto com o mesmo código já existe");
    }

    const product = new ProductEntity({ ...productDto, id: undefined, status: true });
    return this.productRepository.createProduct(
      product.codigo_produto,
      product.descricao_produto,
      product.foto_produto
    );
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async updateProduct(id: string, data: Partial<ProductDTO>) {
    const currentProduct = await this.productRepository.getProductById(id);
    
    if (!data.foto_produto) {
      delete data.foto_produto;
    }
    
    const updatedProduct = new ProductEntity({ 
      ...currentProduct, 
      ...data, 
      status: data.status === 'true' ? true : false 
    });

    if (data.codigo_produto) {
      const productWithSameCode = await this.productRepository.getProductByCodigo(data.codigo_produto);
      if (productWithSameCode && productWithSameCode.id !== id) {
        throw new Error("Produto com o mesmo código já existe");
      }
    }

    if (currentProduct?.foto_produto && data.foto_produto && data.foto_produto !== currentProduct.foto_produto) {
      await deleteImage(currentProduct.foto_produto);
    }

    return this.productRepository.updateProduct(id, updatedProduct);
  }

  async deleteProduct(id: string) {
    try {
       
      const product = await this.productRepository.getProductById(id);
      
      if (product?.foto_produto) {
         
        await deleteImage(product.foto_produto);
      }

       
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
       
      const products = await this.productRepository.getAllProducts();
      
       
      await Promise.all(
        products
          .filter(product => product.foto_produto)
          .map(product => deleteImage(product.foto_produto))
      );

       
      await this.productRepository.deleteAllProducts();
    } catch (error) {
      throw error;
    }
  }

  async deleteProductImage(id: string) {
    try {
        const product = await this.productRepository.getProductById(id);
        
        if (product?.foto_produto) {
            await deleteImage(product.foto_produto);
            
            const updatedProduct = new ProductEntity({ ...product, foto_produto: null });
            await this.productRepository.updateProduct(id, updatedProduct);
        }
    } catch (error) {
        throw error;
    }
  }
}
