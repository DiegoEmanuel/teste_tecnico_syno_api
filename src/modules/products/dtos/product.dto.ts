import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

export class ProductDTO {
  @IsNotEmpty({ message: "O código do produto é obrigatório" })
  @IsString()
  codigo_produto: string;

  @IsNotEmpty({ message: "A descrição do produto é obrigatória" })
  @IsString({ message: "A descrição do produto deve ser uma string" })
  descricao_produto: string;

  @IsOptional()
  @IsString()
  foto_produto?: string;

  @IsNotEmpty({ message: "O status do produto é obrigatório" })
  @IsString()
  status?: string;
}

export class ProductCreateDTO {
  @IsNotEmpty({ message: "O código do produto é obrigatório" })
  @IsString()
  codigo_produto: string;

  @IsNotEmpty({ message: "A descrição do produto é obrigatória" })
  @IsString({ message: "A descrição do produto deve ser uma string" })
  descricao_produto: string;

  @IsOptional()
  @IsString()
  foto_produto?: string;
}



