
import User from "../../models/User";
import { Request, Response } from "express";

import Product  from "../../models/Product";
import Likes from "../../models/Likes";

interface CreateLikeProps {
  likes: string, 
  user: string, 
  product: string 
}

export const createLike = async (req: Request, res: Response) => {
    const { likes, user, product }: CreateLikeProps = req.body;
  
    try {
      // Verificar se o usuário existe
      const userExists = await User.findById(user);
      if (!userExists) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
  
      // Verificar se o product existe
      const productExists = await Product.findById(product);
      if (!productExists) {
        res.status(404).json({ error: "Product não encontrado" });
        return;
      }
  
      // Verificar se o usuário já deu like no product
      const existingLike = await Likes.findOne({ user, product });
      if (existingLike) {
        res.status(400).json({ error: "Você já deu like neste product" });
        return;
      }
  
      // Criar o like
      const newLike = new Likes({
        likes: likes || 1, // Incremento padrão como 1
        user,
        product,
      });
  
      const savedLike = await newLike.save();
  
      // Atualizar o campo likes no product
      await Product.findByIdAndUpdate(
        product,
        { $push: { likes: savedLike.id } }, // Adiciona o ID do like ao array de likes
        { new: true }
      );
  
      res.status(201).json({ message: "Você deu like no product", savedLike });
    } catch (error) {
      console.error("Erro ao criar like:", error);
      res.status(500).json({ error: "Houve um erro, tente mais tarde." });
    }
  };

  export const getLikes = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const likes = await Likes.find()
       
      if (!likes || likes.length === 0) {
        res.status(404).json({ error: "Nenhum produto encontrado." });
        return;
      }
  
      res.status(200).json(likes);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      res.status(500).json({ error: "Erro ao buscar produtos, tente novamente mais tarde." });
    }
  };

  export const deleteLikes = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Corrigido para "id"
  
    if (!id) {
      res.status(400).json({ error: "ID do comentário não fornecido." });
      return;
    }
  
    try {
      const likes = await Likes.findById(id);
      if (!likes) {
        res.status(404).json({ error: "Comentário não encontrado." });
        return;
      }
  
      await Likes.findByIdAndDelete(id);
      await Product.findByIdAndUpdate(likes.product, { $pull: { likes: id } });
  
      res.status(200).json({ message: "Comentário excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      res.status(500).json({ error: "Erro interno ao excluir comentário." });
    }
  };