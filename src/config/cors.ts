import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
   origin: function(origin, callback){

    const whiteList: string[] = []
    whiteList.push(process.env.FRONTEND_URL)

    if(process.argv[2] === '--api'){
        whiteList.push(undefined)
    }
      
    if(whiteList.includes(origin)){
        callback(null, true)
    }else {
        callback(new Error('Erro de Cors'))
    }
   }
}

// import { CorsOptions } from "cors";

// export const corsConfig: CorsOptions = {
//   origin: function (origin, callback) {
//     const whiteList: string[] = [process.env.FRONTEND_URL];

//     // Permitir undefined (caso de testes locais ou API interna)
//     if (process.env.NODE_ENV === "development") {
//       whiteList.push(undefined);
//     }

//     if (whiteList.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error(`⚠️ Bloqueio CORS para origem: ${origin}`);
//       callback(new Error("Erro de CORS: Origem não permitida"));
//     }
//   },
//   credentials: true, // Permite envio de cookies/autenticação se necessário
// };
