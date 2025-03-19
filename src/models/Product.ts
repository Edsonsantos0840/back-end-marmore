
import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  title: string;
  category: string;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  description?: string;
  comments?: mongoose.Schema.Types.ObjectId[]; // Lista de comentários
  likes?: mongoose.Schema.Types.ObjectId[]; // Lista de likes
}

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true, // Corrigido: equire -> required
    lowercase: true,
  },
  image1: {
    type: String,
    default: "",
  },
  image2: {
    type: String,
    default: "",
  },
  image3: {
    type: String,
    default: "",
  },
  image4: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments", // Referência ao modelo Comments
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Likes", // Referência ao modelo Likes
    },
  ],
}, {
  timestamps: true, // Inclui createdAt e updatedAt automaticamente
});

const Product = mongoose.model<Product>("Product", productSchema);

export default Product;
