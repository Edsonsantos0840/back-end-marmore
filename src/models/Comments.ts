
import mongoose, { Schema, Document } from "mongoose";

export interface CommentsProps extends Document {
  comments: string;
  user: mongoose.Schema.Types.ObjectId; // Referência ao usuário
  product: mongoose.Schema.Types.ObjectId; // Referência ao produto
}

const commentsSchema = new Schema({
  comments: {
    type: String,
    required: true, // Corrigido: require -> required
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Referência ao modelo User
    
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Produtos", // Referência ao modelo Produtos
    required: true,
  },
}, {
  timestamps: true, // Inclui createdAt e updatedAt automaticamente
});

const Comments = mongoose.model<CommentsProps>("Comments", commentsSchema);

export default Comments;
