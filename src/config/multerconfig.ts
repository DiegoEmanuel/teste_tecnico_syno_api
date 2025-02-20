import multer from "multer";
import path from "path";

// Configuração para salvar em memória quando usar Firebase
const useFirebase = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;
