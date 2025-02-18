import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductDTO } from "./product.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { ProductEntity } from '../../entities/product.entity';

interface MulterRequest extends Request {
    file?: Express.Multer.File & { url?: string };
}

export class ProductController {
  constructor(private productService: ProductService = new ProductService()) { }


  async createProduct(req: MulterRequest, res: Response) {
    try {
      const productDto = plainToClass(CreateProductDTO, req.body);
      const errors = await validate(productDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Se houver arquivo, usa a URL do Firebase
      if (req.file?.url) {
        productDto.foto_produto = req.file.url;
      }

      const product = await this.productService.createProduct(new ProductEntity(productDto));
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao criar produto" });
    }
  }

  async updateProduct(req: MulterRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (data.codigo_produto) {
        const existingProduct = await this.productService.getProductByCodigo(data.codigo_produto);
        if (existingProduct && existingProduct.id !== id) {
          return res.status(400).json({
            errors: [{
              property: "codigo_produto",
              constraints: { isUnique: "Produto com o mesmo código já existe" }
            }]
          });
        }
      }

      // Se houver arquivo, atualiza a URL da imagem
      if (req.file?.url) {
        data.foto_produto = req.file.url;
      }

      const existingProduct = await this.productService.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const product = await this.productService.updateProduct(id, data);
      return res.json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao atualizar produto" });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      // Como já temos a URL completa vinda do Firebase, não é necessário modificá-la
      return res.json(products);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao obter produtos" });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Verifica se produto existe
        const existingProduct = await this.productService.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Deleta produto e sua imagem
        await this.productService.deleteProduct(id);
        return res.json({ message: "Produto e imagem deletados com sucesso" });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
  }

  async deleteAllProducts(req: Request, res: Response) {
    try {
      await this.productService.deleteAllProducts();
      return res.json({ message: "Todos os produtos foram deletados com sucesso" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao deletar todos os produtos" });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      return res.json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao obter produto" });
    }
  }

  async deleteProductImage(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        const existingProduct = await this.productService.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        if (!existingProduct.foto_produto) {
            return res.status(400).json({ error: "Produto não possui imagem" });
        }

        // Deleta apenas a imagem e atualiza o produto
        await this.productService.deleteProductImage(id);
        return res.json({ message: "Imagem deletada com sucesso" });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
  }
}
