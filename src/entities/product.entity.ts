export class ProductEntity {
    id: string;
    codigo_produto: string;
    descricao_produto: string;
    status: boolean;
    foto_produto?: string;

    constructor(data: Partial<ProductEntity>) {
        Object.assign(this, data);
        this.status = data.status ?? true;
    }
} 