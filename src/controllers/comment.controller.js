import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async(req, res)=>{
    const {postId} = req.params 
    const userId = req.user?._id 
    const {comment} = req.body 

    if(!postId){
        throw new ApiError(400, 'Post Id is required!')
    }

    const newComment = await Comment.create({
        comment, 
        commentedBy: userId, 
        commentedTo: postId 
    })

    const addedComment = await Comment.findById(newComment._id) 

    if(!addedComment){
        throw new ApiError(404, 'Something went wrong while adding the comment!') 
    }

    return res
    .status(200)
    .json(new ApiResponse(200, addedComment, 'New Comment is added to this post!'))
})

const getComments = asyncHandler(async(req, res)=>{
    const {postId} = req.params 
    
    const comments = await Comment.find({commentedTo: postId})?.populate('commentedBy', 'profilePic username') 

    if(comments.length===0){
        return res
        .status(200)
        .json(new ApiResponse(200, comments, 'No comments are there!'))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comments, 'All comments on this post!'))
})

export {addComment, getComments}