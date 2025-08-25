import { CorsOptions } from "cors";

const whiteList: string[] = [
  'https://site-marmormore.vercel.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

export const corsConfig: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Erro de Cors'));
    }
  }
};
