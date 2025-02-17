import { Request } from 'express';

export function buildImageUrl(req: Request, filename: string): string {
    const baseUrl =
        process.env.NODE_ENV === "production"
            ? "https://teste-tecnico-syno-api.onrender.com"
            : `${req.protocol}://${req.get("host")}`;

    return `${baseUrl}/uploads/products/${filename}`;
}