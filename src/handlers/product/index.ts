
import { Request, Response } from "express";
import Product from "../../models/Product";
import Comments from "../../models/Comments";
import Likes from "../../models/Likes";
import mongoose from "mongoose";

interface ProdutoProps {
  _id: string;
  title: string;
  image1: string ;
  image2?: string ;
  image3?: string ;
  image4?: string ;
  category: string;
  description: string;
  comments: [];
  likes:[];
  createdAt: Date;
  updatedAt: Date;
}

export const createProduct = async (req: Request, res: Response) => {
  const { 
    title, 
    category , 
    description , 
    image1, 
    image2, 
    image3 , 
    image4 , 
    comments , 
    likes 
  }: ProdutoProps = req.body;
  
  
    try {
      // Validação e criação de produtos (se fornecidos)
      let commentsIds: mongoose.Schema.Types.ObjectId[] = [];
      if (comments && Array.isArray(comments)) {
        for (const commentData of comments) {
          const newComment = new Comments(commentData);
          const savedComment = await newComment.save();
          commentsIds.push(savedComment.id);
        }
      }
  
      // Validação e criação de likes (se fornecidos)
      let likesIds: mongoose.Schema.Types.ObjectId[] = [];
      if (likes && Array.isArray(likes)) {
        for (const likeData of likes) {
          const newLike = new Likes(likeData);
          const savedLike = await newLike.save();
          likesIds.push(savedLike.id);
        }
      }
  
      // Criação do produto com os IDs relacionados
      const product = new Product({
        title,
        category,
        description,
        image1,
        image2,
        image3,
        image4,
        comments: commentsIds, // Associa os produtos criados
        likes: likesIds,       // Associa os likes criados
      });
  
      await product.save();

      res.status(201).json("Produto criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(400).json({ error: "Houve um erro, tente mais tarde." });
    }
  };
  
  // export const getProducts = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     // Busca todos os produtos e popula produtos e curtidas
  //     const products = await Product.find()
  //       .populate("comments") // Popula os produtos
  //       .populate("likes");   // Popula as curtidas
  
  //     if (!products || products.length === 0) {
  //       res.status(404).json({ error: "Nenhum produto encontrado." });
  //       return;
  //     }
  
  //     res.status(200).json(products);
  //   } catch (error) {
  //     console.error("Erro ao buscar produtos:", error);
  //     res.status(500).json({ error: "Erro ao buscar produtos, tente novamente mais tarde." });
  //   }
  // };
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Recebe `limit` e `page` como query params
    const limit = parseInt(req.query.limit as string) || 10; // padrão: 20 itens
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Busca os produtos com limite e offset (skip)
    const products = await Product.find()
      .populate("comments")
      .populate("likes")
      .limit(limit)
      .skip(skip);

    if (!products || products.length === 0) {
      res.status(404).json({ error: "Nenhum produto encontrado." });
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos, tente novamente mais tarde." });
  }
};

  // export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  //   const { category } = req.params;
  
  //   try {
  //     const products = await Product.find({ category: category.toLowerCase() })
  //       .populate("comments")
  //       .populate("likes");
  
  //     if (!products || products.length === 0) {
  //       res.status(404).json({ error: `Nenhum produto encontrado na categoria "${category}".` });
  //       return;
  //     }
  
  //     res.status(200).json(products);
  //   } catch (error) {
  //     console.error("Erro ao buscar produtos por categoria:", error);
  //     res.status(500).json({ error: "Erro ao buscar produtos, tente novamente mais tarde." });
  //   }
  // };
  export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;

  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: category.toLowerCase() })
      .populate("comments")
      .populate("likes")
      .limit(limit)
      .skip(skip);

    if (!products || products.length === 0) {
      res.status(404).json({ error: `Nenhum produto encontrado na categoria "${category}".` });
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    res.status(500).json({ error: "Erro ao buscar produtos, tente novamente mais tarde." });
  }
};


  export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id)
        .populate("comments") // Popula os comentários
        .populate("likes");   // Popula as curtidas
  
      if (!product) {
        res.status(404).json({ error: "Produto não encontrado." });
        return;
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error("Erro ao buscar produto por ID:", error);
      res.status(500).json({ error: "Erro ao buscar produto, tente novamente mais tarde." });
    }
  };

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Obtém o ID do produto da URL
  const { title, category, description, image1, image2, image3, image4 }: ProdutoProps = req.body;

  try {
    // Verifica se o produto existe
    const product = await Product.findById(id);
    if (!product) {
       res.status(404).json({ error: "Produto não encontrado." });
       return
    }

    // Atualiza os campos do produto apenas se forem enviados
    if (title) product.title = title;
    if (category) product.category = category;
    if (description) product.description = description;
    if (image1) product.image1 = image1;
    if (image2) product.image2 = image2;
    if (image3) product.image3 = image3;
    if (image4) product.image4 = image4;

    await product.save(); // Salva as alterações no banco de dados

     res.status(200).json({ message: "Produto atualizado com sucesso.", product });
     return
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
     res.status(500).json({ error: "Erro ao atualizar o produto. Tente novamente mais tarde." });
     return
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Corrigido para "id"

  if (!id) {
    res.status(400).json({ error: "ID do produto não fornecido." });
    return;
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "produto não encontrado." });
      return;
    }

    await Product.findByIdAndDelete(id);
  

    res.status(200).json({ message: "produto excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: "Erro interno ao excluir produto." });
  }
};
  
