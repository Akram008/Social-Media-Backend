import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logout, registerUser, currentUser, getSearchUsers, getUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router() 

router.route('/register').post(upload.single('profilePic'), registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(verifyJWT, logout)
router.route('/current-user').get(verifyJWT, currentUser)
router.route('/search').get(verifyJWT, getSearchUsers)
router.route('/:userId').get(getUser)

export default router