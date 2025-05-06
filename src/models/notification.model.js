import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        notificationType: {
            type: String, 
            enum: ['Like', 'Comment', 'Track'], 
            required: true
        }, 
        byUser: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        }, 
        toUser: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },  
        postId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Post"
        },
        content:{
            type: String, 
            default: ''
        },
        isRead: {
            type: Boolean, 
            required: true, 
            default: false
        }

    }, {timestamps: true}
)

export const Notification = mongoose.model('Notification', notificationSchema)