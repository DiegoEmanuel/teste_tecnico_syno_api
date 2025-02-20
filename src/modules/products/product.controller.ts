import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { ProductEntity } from '../../entities/product.entity';

interface MulterRequest extends Request {
    file?: Express.Multer.File & { url?: string };
}

export class ProductController {
  constructor(private productService: ProductService = new ProductService()) { }

  async createProduct(req: MulterRequest, res: Response) {
    try {
      const productData = {
        ...req.body,
        foto_produto: req.file?.url || null
      };

      const product = await this.productService.createProduct(new ProductEntity(productData));
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao criar produto" });
    }
  }

  async updateProduct(req: MulterRequest, res: Response) {
    try {
      const productData = {
        ...req.body,
        foto_produto: req.file?.url || null
      };

      const product = await this.productService.updateProduct(req.params.id, productData);
      return res.json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao atualizar produto" });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      return res.json(products);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Erro ao obter produtos" });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const existingProduct = await this.productService.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

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

        await this.productService.deleteProductImage(id);
        return res.json({ message: "Imagem deletada com sucesso" });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
  }
}
