import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTotalLikes, isLiked, toggleLike } from "../controllers/like.controller.js";

const router = Router()

router.route('/toggleLike/:postId').post(verifyJWT, toggleLike) 
router.route('/isLiked/:postId').get(verifyJWT, isLiked) 
router.route('/totalLikes/:postId').get(getTotalLikes)

export default router