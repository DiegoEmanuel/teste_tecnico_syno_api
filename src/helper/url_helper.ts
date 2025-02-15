// helpers/url.helper.ts
import { Request } from "express";

export function buildImageUrl(req: Request, filename: string): string {
    return `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
}
