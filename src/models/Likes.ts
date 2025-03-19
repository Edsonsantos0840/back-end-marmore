
import mongoose, { Schema, Document } from "mongoose";

export interface LikesProps extends Document {
  likes: String;
  user: mongoose.Schema.Types.ObjectId; // Referência ao usuário
  product: mongoose.Schema.Types.ObjectId; // Referência ao product
}

const likesSchema = new Schema({
  likes: { 
    type: String, 
    require: true, 
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Referência ao modelo User
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Products", // Referência ao modelo Products
    required: true,
  },
}, {
  timestamps: true, // Inclui createdAt e updatedAt automaticamente
});

const Likes = mongoose.model<LikesProps>("Likes", likesSchema);

export default Likes;
