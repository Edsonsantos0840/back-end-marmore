
import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  tipo: string;
  image?: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true, // Corrigido: require -> required
    trim: true,
  },
  email: {
    type: String,
    required: true, // Corrigido: equire -> required
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true, // Corrigido: equire -> required
    trim: true,
  },
  tipo: {
    type: String,
    default: "usuário",
  },
  image: {
    type: String,
    default: "",
  },
}, {
  timestamps: true, // Inclui createdAt e updatedAt automaticamente
});

const User = mongoose.model<User>("User", userSchema);

export default User;
