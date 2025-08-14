
import User from "../../models/User";
import { Request, Response } from "express";
import Product from "../../models/Product";
import Comments from "../../models/Comments";

interface CreateCommentProps {
  comments: string, 
  user: string, 
  product: string 
}

export const createComment = async (req: Request, res: Response): Promise<void> => {
  const { comments, user, product }: CreateCommentProps = req.body;

  if (!comments || !user || !product) {
    res.status(400).json({ error: "Dados incompletos para criar o comentário." });
    return;
  }

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

    const newComment = new Comments({
      comments,
      user,
      product,
    });

    const savedComment = await newComment.save();

    await Product.findByIdAndUpdate(
      product,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    res.status(500).json({ error: "Erro interno ao criar comentário." });
  }
};
  
  // export const getComments = async (req: Request, res: Response): Promise<void> => {
  //   try {
      
  //     const comments = await Comments.find()
       
  //     if (!comments || comments.length === 0) {
  //       res.status(404).json({ error: "Nenhum produto encontrado." });
  //       return;
  //     }
  
  //     res.status(200).json(comments);
  //   } catch (error) {
  //     console.error("Erro ao buscar produtos:", error);
  //     res.status(500).json({ error: "Erro ao buscar produtos, tente novamente mais tarde." });
  //   }
  // };
  export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const limitParam = req.query.limit as string;
    const pageParam = req.query.page as string;

    // 🔹 Se não houver paginação, retorna todos
    if (!limitParam && !pageParam) {
      const comments = await Comments.find();
      if (!comments.length) {
        res.status(404).json({ error: "Nenhum comentário encontrado." });
        return;
      }
      res.status(200).json({
        comments,
        total: comments.length,
        totalPages: 1,
        currentPage: 1
      });
      return;
    }

    // 🔹 Paginação
    const limit = parseInt(limitParam) || 10;
    const page = parseInt(pageParam) || 1;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comments.find().skip(skip).limit(limit),
      Comments.countDocuments()
    ]);

    if (!comments.length) {
      res.status(404).json({ error: "Nenhum comentário encontrado." });
      return;
    }

    res.status(200).json({
      comments,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    res.status(500).json({ error: "Erro ao buscar comentários, tente novamente mais tarde." });
  }
};


  export const getCommentsByProductId = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Aqui o "id" é o ID do produto
  
    try {
      const comments = await Comments.find({ product: id }).populate("user", "name image");
  
      if (!comments || comments.length === 0) {
        res.status(404).json({ error: "Nenhum comentário encontrado para este produto." });
        return;
      }
  
      res.status(200).json(comments);
    } catch (error) {
      console.error("Erro ao buscar comentários por produto ID:", error);
      res.status(500).json({ error: "Erro ao buscar comentários, tente novamente mais tarde." });
    }
  };

  export const updateComment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Obtém o ID do comment da URL
    const { comments, user, product }: CreateCommentProps = req.body;

    if (!comments || !user || !product) {
      res.status(400).json({ error: "Dados incompletos para criar o comentário." });
      return;
    }
  
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
  
      // Verifica se o produto existe
      const comment = await Comments.findById(id);
      if (!comment) {
         res.status(404).json({ error: "Produto não encontrado." });
         return
      }

    if (comments) comment.comments = comments;
 
  
      await comment.save(); // Salva as alterações no banco de dados
  
       res.status(200).json({ message: "Produto atualizado com sucesso.", comment });
       return
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
       res.status(500).json({ error: "Erro ao atualizar o produto. Tente novamente mais tarde." });
       return
    }
  };

  export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Corrigido para "id"
  
    if (!id) {
      res.status(400).json({ error: "ID do comentário não fornecido." });
      return;
    }
  
    try {
      const comment = await Comments.findById(id);
      if (!comment) {
        res.status(404).json({ error: "Comentário não encontrado." });
        return;
      }
  
      await Comments.findByIdAndDelete(id);
      await Product.findByIdAndUpdate(comment.product, { $pull: { comments: id } });
  
      res.status(200).json({ message: "Comentário excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      res.status(500).json({ error: "Erro interno ao excluir comentário." });
    }
  };
  