import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async(req, res)=>{
    const {postId} = req.params 
    const userId = req.user?._id 

    const like = await Like.findOne({likedBy: userId, liked: postId}) 
    console.log(like)

    if(!like){
        const like = await Like.create({
            likedBy: userId, 
            liked: postId
        })

        const newLike = await Like.findById(like._id) 

        return res
        .status(200)
        .json(new ApiResponse(200, newLike, 'Post is liked!'))
    }
    else{
        await Like.findByIdAndDelete(like._id)  
        return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Post is Unliked!'))
    }
})

const isLiked = asyncHandler(async(req, res)=>{
    const {postId} = req.params 
    const userId = req.user?._id 

    const like = await Like.findOne({likedBy: userId, liked: postId}) 

    if (!like) {
        return res
        .status(200)
        .json(new ApiResponse(200, false, 'This post is not liked by user!'))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, true, 'This post is liked by user!'))
})

const getTotalLikes = asyncHandler(async(req, res)=>{
    const {postId} = req.params 

    const likes = await Like.find({liked: postId}) 

    if (!likes) {
        throw new ApiError(404, 'Something went wrong while fetching the likes')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, likes.length, "No. of likes on this post!"))
})

export {toggleLike, isLiked, getTotalLikes}