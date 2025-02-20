export class ProductEntity {
    id: string;
    codigo_produto: string;
    descricao_produto: string;
    status: boolean;
    foto_produto?: string;

    constructor(data: ProductEntity) {
        Object.assign(this, {
            ...data,
            status: typeof data.status === 'string' ? data.status === 'true' : data.status ?? true
        });
    }
} 