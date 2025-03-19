import { body } from "express-validator";
import type {Request, Response, NextFunction} from 'express'

export const authRegister = async (req: Request, res: Response, next: NextFunction) => {
  body("name")
    .notEmpty()
    .withMessage("O campo Nome está vazio."),
  body("email")
    .isEmail()
    .withMessage("email inválido."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("O campo precisa ter pelo-menos 6 caracteres.") 
    next()
}

export const authLogin = async (req: Request, res: Response, next: NextFunction) => {
    body("email")
    .isEmail()
    .withMessage("email inválido!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("O campo de password é obrigatório!"),
    
    next()
}

export const authProfile = async (req: Request, res: Response, next: NextFunction) => {
body("description")
  .notEmpty()
  .withMessage("O campo descrição está vazio."),
  next()
}