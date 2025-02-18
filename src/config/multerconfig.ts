import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

export default upload;
