import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNotification = asyncHandler(async(req, res)=>{
    const byUser = req.user?._id 
    
    const {notificationType, toUser, postId, content} = req.body 

    if ([notificationType, toUser].some((field)=>field?.trim === '')) {
        throw new ApiError(404, 'All fields are required!')
    }

    const notification = await Notification.create({
        notificationType, 
        toUser,
        byUser, 
        postId, 
        content
    })

    const newNotification = await Notification.findById(notification._id) 

    if(!newNotification){
        throw new ApiError(400, 'Some went wrong while creating the notification!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, newNotification, "Notification created successfully!"))
})

const getAllNotificationsOfUser = asyncHandler(async(req, res)=>{
    const userId = req.user._id 
    
    const notifications = await Notification.find({toUser: userId}).populate([{path:'byUser', select: 'username profilePic'},{path: 'postId', select:'title'}]) 

    return res
    .status(200)
    .json(new ApiResponse(200, notifications, 'All notifications are fetched!'))
})

export {createNotification, getAllNotificationsOfUser}