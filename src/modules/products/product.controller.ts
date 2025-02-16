import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductDTO } from "./product.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { buildImageUrl } from "../../helper/url_helper";


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

      productDto.foto_produto = req.file?.filename;

      const product = await this.productService.createProduct(productDto);

      if (product.foto_produto) {
        product.foto_produto = buildImageUrl(req, product.foto_produto);
      }

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
        data.foto_produto = req.file.filename;
      }

      const existingProduct = await this.productService.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const product = await this.productService.updateProduct(id, data);

      if (product && product.foto_produto) {
        product.foto_produto = buildImageUrl(req, product.foto_produto);
      }
      return res.json(product);
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      return res.status(400).json({ error: error.message || "Erro ao atualizar produto" });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      const productsWithImages = products.map(product => {
        if (product.foto_produto) {
          product.foto_produto = buildImageUrl(req, product.foto_produto);
        }
        return product;
      });
      return res.json(productsWithImages);
    } catch (error: any) {
      console.error("Erro ao obter produtos:", error);
      return res.status(400).json({ error: error.message || "Erro ao obter produtos" });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    // try {

    //   const existingProduct = await this.productService.getProductById(req.params.id);
    //   if (!existingProduct) {
    //     return res.status(404).json({ error: "Produto não encontrado" });
    //   }

    //   const { id } = req.params;
    //   await this.productService.deleteProduct(id);
    //   return res.sendStatus(204);
    // } catch (error: any) {
    //   console.error("Erro ao deletar produto:", error);
    //   return res.status(400).json({ error: error.message || "Produto não encontrado" });
    // }
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
      if (product && product.foto_produto) {
        product.foto_produto = buildImageUrl(req, product.foto_produto);
      }
      return res.json(product);
    } catch (error: any) {
      console.error("Erro ao obter produto por ID:", error);
      return res.status(400).json({ error: error.message || "Erro ao obter produto" });
    }
  }
}
