import color from "colors";
import User from "../../models/User";

import { Request, Response } from "express";

import {  hashPassword } from "../../utils/auth";

interface UserProps {
  _id?: string,
  name: string,
  email: string,
  password: string,
  tipo?: string,
  image?: string,
  createdAt?: Date
  updatedAt?: Date
}

export const createUsers = async (req: Request, res: Response): Promise<void> => { 
  const { name, email, password, tipo, image }: UserProps = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(409).json({ error: "O Email já está em uso" });
    return
  }

  const user = new User({
    name,
    email,
    password: await hashPassword(password),
    tipo,
    image: image || undefined, // Garante que image só é definida se existir
  });
  
  try {
    await user.save();
    res.status(201).json("Usuário criado com sucesso");
  } catch (error) {
    res.status(400).json({ error: "Houve um erro, tente mais tarde" });
  }
};

  export const getUserAuth = async (req: Request, res: Response) => {
    res.json(req.user);
  };

// export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // 👉 Lê o limite da query string, ou usa 10 como padrão
//     const limit = parseInt(req.query.limit as string) || 10;

//     const users = await User.find().limit(limit);

//     if (!users || users.length === 0) {
//       res.status(404).json({ error: "Nenhum usuário encontrado." });
//       return;
//     }

//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Erro ao buscar usuários:", error);
//     res.status(500).json({ error: "Erro ao buscar usuários. Tente novamente mais tarde." });
//   }
// };
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const limitParam = req.query.limit as string;
    const pageParam = req.query.page as string;

    // Se não passar paginação, busca todos
    if (!limitParam && !pageParam) {
      const users = await User.find();
      if (!users.length) {
        res.status(404).json({ error: "Nenhum usuário encontrado." });
        return;
      }
      res.status(200).json({
        users,
        total: users.length,
        totalPages: 1,
        currentPage: 1
      });
      return;
    }

    // Caso tenha paginação
    const limit = parseInt(limitParam) || 10;
    const page = parseInt(pageParam) || 1;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments()
    ]);

    if (!users.length) {
      res.status(404).json({ error: "Nenhum usuário encontrado." });
      return;
    }

    res.status(200).json({
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários. Tente novamente mais tarde." });
  }
};


export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
      const user = await User.findById(id);

      if (!user) {
         res.status(404).json({ error: "Usuário não encontrado." });
         return
      }

      res.status(200).json(user);
  } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro ao buscar usuário. Tente novamente mais tarde." });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Obtém o ID do usuário da URL
  const { name, email, image }: { name: string, email: string, image: string } = req.body;

  try {
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.image = image || user.image;

      await user.save();

      res.status(200).json({ message: "Usuário atualizado com sucesso", user });
  } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar o usuário" });
  }
};


  export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Corrigido para "id"
  
    if (!id) {
      res.status(400).json({ error: "ID do usuário não fornecido." });
      return;
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ error: "usuário não encontrado." });
        return;
      }
  
      await User.findByIdAndDelete(id);
  
      res.status(200).json({ message: "usuário excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro interno ao excluir usuário." });
    }
  };