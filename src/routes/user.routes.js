import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logout, registerUser, currentUser, getSearchUsers, getUser, updateUser, updateUserProfilePic, changePassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router() 

router.route('/me').get(verifyJWT, (req, res) => {
    
    return res.status(200).json({
      success: true,
      user: req.user, // added by verifyJWT middleware
    })
})
router.route('/register').post(upload.single('profilePic'), registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(verifyJWT, logout)
router.route('/current-user').get(verifyJWT, currentUser)
router.route('/search').get(verifyJWT, getSearchUsers)
router.route('/:userId').get(getUser)
router.route('/updateUser').patch( verifyJWT, updateUser)
router.route('/updateUserProfilePic').patch(verifyJWT, upload.single('profilePic'), updateUserProfilePic)
router.route('/changePassword').patch(verifyJWT, changePassword)

export default router