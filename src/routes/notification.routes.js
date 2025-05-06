import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNotification, getAllNotificationsOfUser } from "../controllers/notification.controller.js";

const router = Router()

router.route('/create').post(verifyJWT, createNotification)
router.route('/getUserNotifications').get(verifyJWT, getAllNotificationsOfUser)

export default router