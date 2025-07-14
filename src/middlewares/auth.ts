import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const autenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer")) {
    res.status(401).json({ error: "Não Autorizado" });
    return;
  }

  const token = bearer.split(" ")[1];

  if (token) {
    // console.log('Esse usuário está autenticado.')
  } else {
    const error = new Error("Não Autorizado");
    res.status(401).json({ error: "Não Autorizado" });
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof result === "object" && result.id) {
      const user = await User.findById(result.id).select("-password");
      if (!user) {
        const error = new Error("O usuário não existe.");
        res.status(404).json({ error: error.message });
      }
      req.user = user;

      next();
    }
  } catch (error) {
    res.status(500).json({ error: "O token não é válido" });
  }
};
