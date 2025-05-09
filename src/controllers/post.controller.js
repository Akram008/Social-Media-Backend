import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadPost = asyncHandler(async(req, res)=>{
    const {title, content, postType} = req.body 
    const userId = req.user?._id  

    if([title, content, postType].some((field)=>field?.trim === '')){
        throw new ApiError(404, 'All fields are required!')
    }

    const user = await User.findById(userId) 

    if(!user){
        throw new ApiError(404, 'User not loggedin!')
    }

    const post = await Post.create({
        title, 
        content, 
        postType, 
        createdBy: user?._id,
    })

    const newPost = await Post.findById(post._id).populate('createdBy') 

    if(!newPost){
        throw new ApiError(400, 'Something went wrong while creating the post!')
    }

    res
    .status(200)
    .json(new ApiResponse(200, newPost, 'Post created Successfully!'))

})

const getAllPostsOfLoggedInUser = asyncHandler(async(req, res)=>{
    const userId = req.user?._id 

    if (!userId) {
        throw new ApiError(400, 'User not loggedIn!')
    }

    const posts = await Post.find({createdBy: userId}) 

    if(posts.length === 0){
        throw new ApiError(404, 'No posts of this user!')
    }

    res
    .status(200)
    .json(new ApiResponse(200, posts, 'All posts of this user fetched!'))
})

const getFeedPosts = asyncHandler(async(req, res)=>{
    const posts = await Post.find()?.populate({path:'createdBy', select: 'username'})

    if (posts.length===0) {
        throw new ApiError(404, 'No feed posts!')
    }

    res
    .status(200)
    .json(new ApiResponse(200, posts, 'Feed posts!'))
})

const getOthersPost = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    const posts = await Post.find({createdBy: userId}) 

    if(posts.length === 0){
        throw new ApiError(400, 'No posts by this user!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, posts, 'All posts by this user have been fetched!'))

})

const deletePost = asyncHandler(async(req, res)=>{
    const {postId} = req.params 
    const userId = req.user._id 

    const post = await Post.findOneAndDelete({_id: postId, createdBy: userId}) 

    if(!post){
        throw new ApiError(404, 'Something went wrong while deleting the post!')
    } 
    
    await Like.deleteMany({liked: postId})
    await Comment.deleteMany({commentedTo: postId})
    await Notification.deleteMany({postId})

    return res
    .status(200)
    .json(new ApiResponse(200, post, 'This post is successfully Deleted!'))
})

export {uploadPost, getAllPostsOfLoggedInUser, getFeedPosts, getOthersPost, deletePost}