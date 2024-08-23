import express from "express";
import * as postControllers from "../controllers/postControllers.js";

const router = express.Router();
router.get("/list", postControllers.listPost);
router.post("/add", postControllers.createPost);
router.delete("/delete/:id", postControllers.deletePost);
router.get("/detail/:id", postControllers.getPostDetails);
router.get("/edit/:id", postControllers.getEditPost);
router.put("/edit/:id", postControllers.updatePost);

export default router;
