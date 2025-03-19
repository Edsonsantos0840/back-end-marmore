import color from "colors";
import User from "../models/User";

import formidable from 'formidable'
import {v4 as uuid} from 'uuid'
import { Request, Response } from "express";

import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinay";

export const login = async (req: Request, res: Response) => {
  const {
    email,
    password,
  }: {
    email: string;
    password: string;
  } = req.body;

  // Verifica se o usuário existe.
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Esse usuário não está registrado!");
    console.log(color.red("houve um erro, tente mais tarde."));
    res.status(404).json({ error: error.message });
    return;
  }

  // Verifica se o email do usuário está correto
  const isPasswordCorrect = await checkPassword(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Password incorreto!");
    console.log(color.red("houve um erro, tente mais tarde."));
    res.status(401).json({ error: error.message });
    return;
  }

  // Gera o token JWT
  const token = generateJWT({ id: user._id });

  // Retorna o token como um JSON válido
  res.status(200).json({ token });
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
   
    await req.user.save();
    res.send("Perfil atualizado com sucesso.");
    
  } catch (error) {
    const erro = new Error("Houve um erro, tente mais tarde.");
    res.status(500).json({ erro: erro.message });
    return
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, async (error, fields, files) => {
      if (error) {
        res.status(400).json({ error: "Houve um erro ao processar a imagem" });
        console.log("Erro ao processar a imagem.");
        return;
      }

      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            res.status(400).json({ error: "Houve um erro ao subir a imagem" });
            console.log("Erro ao subir a imagem.");
            return;
          }

          if (result) {
            const userId = req.params.id || fields.userId; // Captura o ID do usuário da requisição

            if (!userId) {
              return res.status(400).json({ error: "ID do usuário não fornecido" });
            }

            // Buscar o usuário pelo ID passado na requisição
            const user = await User.findById(userId);
            if (!user) {
              return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Atualizar a imagem do usuário correto
            user.image = result.secure_url;
            await user.save();

            res.json({ image: result.secure_url });
          }
        }
      );
    });
  } catch (error) {
    res.status(400).json({ error: "Houve um erro, tente mais tarde" });
    console.log("Erro ao subir a imagem.");
  }
};

export const uploadCreateImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, async (error, fields, files) => {
      if (error) {
        console.error("Erro ao analisar o formulário:", error);
        return res.status(400).json({ error: "Erro ao processar a imagem" });
      }

      if (!files.file || !files.file[0]) {
        console.error("Nenhum arquivo enviado.");
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const file = files.file[0];

      cloudinary.uploader.upload(file.filepath, { public_id: uuid() }, async function (err, result) {
        if (err) {
          console.error("Erro no upload para Cloudinary:", err);
          return res.status(400).json({ error: "Erro ao subir a imagem" });
        }

        if (result) {
          return res.json({ image: result.secure_url });
        }
      });
    });
  } catch (error) {
    console.error("Erro inesperado no servidor:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};