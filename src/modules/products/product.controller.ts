import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductDTO } from "./product.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export class ProductController {
  constructor(private productService: ProductService = new ProductService()) { }

  async createProduct(req: Request, res: Response) {
    try {
      const productDto = plainToClass(CreateProductDTO, req.body);
      const errors = await validate(productDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Validação: se um texto foi enviado em vez de um arquivo
      if (!req.file && typeof req.body.foto_produto === "string") {
        return res.status(400).json({ error: "O campo foto_produto deve ser um arquivo válido." });
      }

      // Salva a URL da imagem que foi enviada ao Firebase
      productDto.foto_produto = req.file?.url;

      const product = await this.productService.createProduct(productDto);

      return res.status(201).json(product);
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      return res.status(400).json({ error: error.message || "Erro ao criar produto" });
    }
  }

  async updateProduct(req: Request, res: Response) {
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

      // Validação: se um texto foi enviado no lugar de um arquivo
      if (!req.file && typeof data.foto_produto === "string") {
        return res.status(400).json({ error: "O campo foto_produto deve ser um arquivo válido." });
      }

      if (req.file) {
        // Salva a URL da imagem enviada ao Firebase
        data.foto_produto = req.file.url;
      }

      const existingProduct = await this.productService.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const product = await this.productService.updateProduct(id, data);
      return res.json(product);
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      return res.status(400).json({ error: error.message || "Erro ao atualizar produto" });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      // Como já temos a URL completa vinda do Firebase, não é necessário modificá-la
      return res.json(products);
    } catch (error: any) {
      console.error("Erro ao obter produtos:", error);
      return res.status(400).json({ error: error.message || "Erro ao obter produtos" });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const existingProduct = await this.productService.getProductById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    await this.productService.deleteProduct(req.params.id);
    return res.json({ message: "Produto deletado com sucesso" });
  }

  async deleteAllProducts(req: Request, res: Response) {
    try {
      await this.productService.deleteAllProducts();
      return res.json({ message: "Todos os produtos foram deletados com sucesso" });
    } catch (error: any) {
      console.error("Erro ao deletar todos os produtos:", error);
      return res.status(400).json({ error: error.message || "Erro ao deletar todos os produtos" });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      return res.json(product);
    } catch (error: any) {
      console.error("Erro ao obter produto por ID:", error);
      return res.status(400).json({ error: error.message || "Erro ao obter produto" });
    }
  }
}
