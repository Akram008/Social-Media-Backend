import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken() 
        const refreshToken = user.generateRefreshToken() 

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        console.log(error)
        throw new ApiError(500, 'Something went wrong while generating tokens!')
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    const {username, email, firstName, lastName, password, bio} = req.body 
    
    if([username, email, firstName, lastName, password].some((field)=>field?.trim==='')){
        throw new ApiError(400, 'All fields are required!')
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, 'User with username or email already exits!')
    }

    const profilePicPath = req.file?.path 
    console.log(profilePicPath)

    const profilePic = await uploadOnCloudinary(profilePicPath)
    console.log(profilePic)

    const user = await User.create({
        username: username.toLowerCase(), 
        email, 
        firstName, 
        lastName, 
        password, 
        bio,
        profilePic: profilePic.url,
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if(!createdUser){
        throw new ApiError(500, 'Something went wrong while registering the user!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, createdUser, 'User Registered Successfully'))
})

const loginUser = asyncHandler(async(req, res)=>{
    const {username, password} = req.body 

    if (!username) {
        throw new ApiError(400, 'Enter Username')
    }

    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(404, 'User does not exit!')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, 'Invalid User Credentials')
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id) 

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true,                // required on HTTPS
        sameSite: 'None',
        domain: 'social-media-vite-6wyf.vercel.app' 
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUser, accessToken}, 'user logged In successfully!'))

})

const logout = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $unset:{
                refreshToken: 1,
            }
        }, 
        {
            new: true 
        }
    )

    const options = {
        httpOnly: true, 
        secure: true, 
        sameSite: 'None', 
        domain: 'social-media-vite-6wyf.vercel.app' 
    }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User loggedOut Successfully!'))
})

const currentUser = asyncHandler(async(req, res)=>{
    const userId = req.user?._id 

    const user = await User.findById(userId) 

    if(!user){
        throw new ApiError(404, 'User does not exist!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, 'User Successfully fetched!'))
})

const getSearchUsers = asyncHandler(async(req,res)=>{
    const {searchedUser} = req.query 

    if(!searchedUser || searchedUser.trim()===''){
        return res.json(new ApiResponse(200, [], 'No users are there!'))
    }

    const users = await User.find({username: {$regex: searchedUser, $options: 'i'}}, {username: 1, firstName: 1, lastName: 1, profilePic: 1 }) 

    if(!users){
        throw new ApiError(400, 'something went wrong while searching the user!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, users, 'All users are fetched!'))
})

const getUser = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    if(!userId){
        throw new ApiError(404, 'UserId is mandatory!')
    }

    const user = await User.findById(userId).select('-password -refreshToken')

    if(!user){
        throw new ApiError(404, 'User not found!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, 'User is fetched!'))
})

const updateUser = asyncHandler(async(req, res)=>{
    const {username, firstName, lastName, email, bio} = req.body 
    const userId = req.user._id 

    const user = await User.findByIdAndUpdate(
        userId, 
        {
            username, 
            firstName, 
            lastName, 
            email, 
            bio,
        }, 
        {new: true}
    )

    if (!user) {
        throw new ApiError(404, 'Something went wrong while updating the user!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, 'User Updated Successfully!'))
})

const updateUserProfilePic = asyncHandler(async(req, res)=>{
    const userId = req.user?._id 
    const profilePicPath = req.file?.path  

    const profilePic = await uploadOnCloudinary(profilePicPath)

    if (!profilePic) {
        throw new ApiError(404, 'Something went wrong while updating the pic!') 
    }

    const user = await User.findByIdAndUpdate(
        userId, 
        {
            profilePic: profilePic.url
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile Picture Successfully Updated!'))
})

export {registerUser, loginUser, logout, currentUser, getSearchUsers, getUser, updateUser, updateUserProfilePic}