import admin from "firebase-admin";
require('dotenv').config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const uploadImage = async (req, res, next) => {
  // Se não houver arquivo, continua o fluxo
  if (!req.file) {
    return next();
  }

  try {
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
        const url = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(nomeArquivo)}?alt=media`;
        req.file.url = url;
        next();
      } catch (error) {
        next(error);
      }
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
}

export default uploadImage;