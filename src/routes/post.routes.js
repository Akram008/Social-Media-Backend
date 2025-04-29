import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllPostsOfLoggedInUser, getFeedPosts, getOthersPost, uploadPost } from "../controllers/post.controller.js";

const router = Router()

router.route('/createPost').post(verifyJWT, uploadPost)
router.route('/loggedInUserPosts').get(verifyJWT, getAllPostsOfLoggedInUser)
router.route('/feedPosts').get(getFeedPosts)
router.route('/userPosts/:userId').get(getOthersPost)

export default router