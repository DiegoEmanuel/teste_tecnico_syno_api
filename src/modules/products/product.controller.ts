import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductDTO } from "./product.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";


const productService = new ProductService();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    const productDto = plainToClass(CreateProductDTO, req.body);
    const errors = await validate(productDto);
    if(errors.length > 0){
      return res.status(400).json({ errors });
    }
    

      ///verificar se ja tem produto com o mesmo codigo
      const productExists = await productService.getProductByCodigo(productDto.codigo_produto);
      if(productExists){
       //retornar no mesmo modelo de erro que os dtos
       return res.status(400).json({ errors: [{ property: "codigo_produto", constraints: { isUnique: "Produto com o mesmo código já existe" } }] });
      }

    const { codigo_produto, descricao_produto, foto_produto, } = productDto;
    try {
      const product = await productService.createProduct(codigo_produto, descricao_produto, foto_produto);
      res.status(201).json(product);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(400).json({ error: "Erro ao criar produto" });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    const products = await productService.getAllProducts();
    res.json(products);
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    try {
      const product = await productService.updateProduct(id, data);
      res.json(product);
    } catch {
      res.status(400).json({ error: "Produto não encontrado" });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await productService.deleteProduct(id);
      res.json({ message: "Produto deletado" });
    } catch {
      res.status(400).json({ error: "Produto não encontrado" });
    }
  }
}
