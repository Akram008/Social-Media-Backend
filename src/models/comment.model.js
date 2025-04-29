import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String, 
            required: true,
        },
        commentedTo: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Post', 
            required: true
        }, 
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }
    }, {timestamps: true}
)

export const Comment = mongoose.model('Comment', commentSchema)