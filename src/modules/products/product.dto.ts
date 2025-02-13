import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateProductDTO {
  @IsNotEmpty({ message: "O código do produto é obrigatório" })
  @IsString()
  codigo_produto: string;

  @IsNotEmpty({ message: "A descrição do produto é obrigatória" })
  @IsString()
  descricao_produto: string;

  @IsOptional()
  @IsString()
  foto_produto?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}



