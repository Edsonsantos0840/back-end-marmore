import { Router } from "express";
import { login, updateProfile, uploadCreateImage, uploadImage } from "./handlers";
import { handleInputErrors } from "./middlewares/validation";
import { authLogin, authProfile, authRegister } from "./middlewares/validaRota";
import { autenticate } from "./middlewares/auth";
import { createUsers, deleteUser,  getAllUsers,  getUserAuth, getUserById, updateUser } from "./handlers/users";
import { createProduct, getProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct } from "./handlers/product";
import { createComment, deleteComment, getComments, getCommentsByProductId, updateComment } from "./handlers/comments";
import { createLike, deleteLikes, getLikes, getLikesByProduct } from "./handlers/likes";


const router = Router();

//Autenticação e registros
router.post("/auth/register", authRegister, handleInputErrors, createUsers);

router.post("/auth/login", authLogin, login);

router.post("/product", authLogin, createProduct);

router.post("/product/comments", authLogin, createComment);

router.post("/product/likes", authLogin, createLike);

router.post('/user/:id/image', autenticate, uploadImage)

router.post('/user/image', autenticate, uploadCreateImage)

router.patch("/user",authProfile, handleInputErrors, autenticate, updateProfile);

router.get("/user", autenticate, getUserAuth);

router.get("/users", getAllUsers); 

router.get("/users/:id", getUserById); 

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.get("/products/category/:category", getProductsByCategory);

router.get("/likes/product/:productId", getLikesByProduct);

router.get("/likes", getLikes);

router.get("/comments", getComments);

router.get("/comments/product/:id", getCommentsByProductId);

router.put("/product/:id", authLogin, updateProduct);

router.put("/user/:id", authLogin, updateUser);

router.put("/product/comments/:id", authLogin, updateComment);

router.delete("/product/comments/:id", authLogin, deleteComment);

router.delete("/product/likes/:id", authLogin, deleteLikes);

router.delete("/product/:id", authLogin, deleteProduct);

router.delete("/user/:id", authLogin, deleteUser);


export default router;
