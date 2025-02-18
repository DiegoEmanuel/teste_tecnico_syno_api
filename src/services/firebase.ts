
import serviceAccount from "../config/firebase-key.json";

const admin = require('firebase-admin');
const BUCKET_NAME = 'syno-2bc76.firebasestorage.app';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET_NAME
});

const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Nenhum arquivo de imagem enviado"));
  }

  const dataAtual = new Date().toISOString().replace(/[:.-]/g, '');
  const nomeArquivo = `${dataAtual}_${req.file.originalname}`;
  const tipoArquivo = req.file.mimetype;

  const bucket = admin.storage().bucket();
  const blob = bucket.file(nomeArquivo);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: tipoArquivo
    }
  });

  blobStream.on('error', (error) => {
    next(error);
  });

  blobStream.on('finish', async () => {
    try {      
      const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(nomeArquivo)}?alt=media`;
      
      req.file.url = url;
      next();
    } catch (error) {
      next(error);
    }
  });

  blobStream.end(req.file.buffer);
}

export default uploadImage;