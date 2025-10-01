
import { Request, Response } from "express";
import User from "../../models/User";
import Product from "../../models/Product";
import Likes from "../../models/Likes";

interface CreateLikeProps {
  likes: string;
  user: string;
  product: string;
}

// Criar Like
export const createLike = async (req: Request, res: Response) => {
  const { likes, user, product }: CreateLikeProps = req.body;

  try {
    const userExists = await User.findById(user);
    if (!userExists) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const productExists = await Product.findById(product);
    if (!productExists) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    const existingLike = await Likes.findOne({ user, product });
    if (existingLike) {
      res.status(400).json({ error: "Você já deu like neste produto" });
      return;
    }

    const newLike = new Likes({
      likes: likes || 1,
      user,
      product,
    });

    const savedLike = await newLike.save();

    await Product.findByIdAndUpdate(
      product,
      { $push: { likes: savedLike.id } },
      { new: true }
    );

    res.status(201).json({ message: "Você deu like no produto", savedLike });
  } catch (error) {
    console.error("Erro ao criar like:", error);
    res.status(500).json({ error: "Houve um erro, tente mais tarde." });
  }
};

// Buscar todos os likes
export const getLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const likes = await Likes.find();

    if (!likes || likes.length === 0) {
      res.status(404).json({ error: "Nenhum like encontrado." });
      return;
    }

    res.status(200).json(likes);
  } catch (error) {
    console.error("Erro ao buscar likes:", error);
    res.status(500).json({ error: "Erro ao buscar likes, tente novamente mais tarde." });
  }
};

// Buscar likes por produto
export const getLikesByProduct = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;

  if (!productId) {
    res.status(400).json({ error: "ID do produto não fornecido." });
    return;
  }

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    const likes = await Likes.find({ product: productId }).populate("user", "name email");

    res.status(200).json({
      totalLikes: likes.length,
      likes,
    });
  } catch (error) {
    console.error("Erro ao buscar likes por produto:", error);
    res.status(500).json({ error: "Erro ao buscar likes, tente novamente mais tarde." });
  }
};

// Deletar Like
export const deleteLikes = async (req: Request, res: Response) => {
  const { id } = req.params; // ID do like na URL

  try {
    const like = await Likes.findByIdAndDelete(id);

    if (!like) {
      res.status(404).json({ error: "Like não encontrado." });
      return;
    }

    // remove a referência do like no produto
    await Product.findByIdAndUpdate(like.product, { $pull: { likes: like._id } });

    res.status(200).json({ message: "Like removido com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir like:", error);
    res.status(500).json({ error: "Erro interno ao excluir like." });
  }
};

