import { Request, Response, NextFunction } from "express";
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

// Estende o tipo Request do Express para incluir o file do Multer
interface MulterRequest extends Request {
    file?: Express.Multer.File & { url?: string };
}

const uploadImage = async (req: MulterRequest, res: Response, next: NextFunction) => {
  // Se não houver arquivo, continua o fluxo
  if (!req.file) {
    return next();
  }

  try {
    //basicamente ele substitui todos os caracteres especiais por nada, deixando apenas os numeros e letras
    const dataAtual = new Date().toISOString().replace(/[:.-]/g, ''); 
    const nomeArquivo = `${dataAtual}_${req.file.originalname}`;
    const tipoArquivo = req.file.mimetype;

    const bucket = admin.storage().bucket(); //pega o bucket do firebase
    const blob = bucket.file(nomeArquivo); //pega o arquivo do firebase
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: tipoArquivo
      }
    }); //cria o stream do arquivo

    blobStream.on('error', (error) => {
      next(error);
    });

    blobStream.on('finish', async () => {
      try {      
        //esse try pega os erros de permissão
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

export const deleteImageFromFirebase = async (imageUrl: string) => {
  try {
    if (!imageUrl) return;

    // Extrai o nome do arquivo da URL do Firebase
    const fileName = imageUrl.split('/o/')[1].split('?')[0];
    const decodedFileName = decodeURIComponent(fileName);

    const bucket = admin.storage().bucket();
    const file = bucket.file(decodedFileName);

    // Verifica se o arquivo existe
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`Arquivo ${decodedFileName} deletado com sucesso`);
    }
  } catch (error) {
    console.error('Erro ao deletar imagem do Firebase:', error);
    throw new Error('Erro ao deletar imagem');
  }
};

export default uploadImage;