import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, unique + extname(file.originalname));
    },
  }),
};
