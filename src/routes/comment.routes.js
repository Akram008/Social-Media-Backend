import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = Router()

router.route('/addComment/:postId').post(verifyJWT, addComment)
router.route('/getComments/:postId').get(getComments)

export default router