import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export function validateBody(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToInstance(DtoClass, req.body);
      const errors = await validate(dtoObject);

      if (errors.length > 0) {
        const validationErrors = errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));
        res.status(400).json({ errors: validationErrors });
        return;
      }

      req.body = dtoObject;
      next();
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro de validação" });
      return;
    }
  };
} 