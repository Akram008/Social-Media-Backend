import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deletePost, getAllPostsOfLoggedInUser, getFeedPosts, getOthersPost, getPost, updatePost, uploadPost } from "../controllers/post.controller.js";

const router = Router()

router.route('/createPost').post(verifyJWT, uploadPost)
router.route('/loggedInUserPosts').get(verifyJWT, getAllPostsOfLoggedInUser)
router.route('/post/:postId').get(verifyJWT, getPost)
router.route('/feedPosts').get(getFeedPosts)
router.route('/userPosts/:userId').get(getOthersPost)
router.route('/deletePost/:postId').delete(verifyJWT, deletePost)
router.route('/updatePost/:postId').patch(verifyJWT, updatePost)

export default router