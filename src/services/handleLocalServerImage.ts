import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

interface MulterRequest extends Request {
    file?: Express.Multer.File & { url?: string };
}
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const uploadImageToServer = async (req: MulterRequest, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next();
    }

    try {
        req.file.url = `${BASE_URL}/uploads/${req.file.filename}`;
        next();
    } catch (error) {
        next(error);
    }
};

export const deleteImage = async (imageUrl: string) => {
    try {
        if (!imageUrl) return;

        const fileName = imageUrl.split('/uploads/')[1];
        if (!fileName) return;

        const filePath = path.join(uploadsDir, fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        throw new Error('Erro ao deletar imagem');
    }
};

export default uploadImageToServer; 