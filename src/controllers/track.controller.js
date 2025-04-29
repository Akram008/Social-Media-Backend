import { Track } from "../models/track.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleTracking = asyncHandler(async(req, res)=>{
    const {trackingId} = req.params 
    const trackerId = req.user?._id 

    const trackDoc = await Track.findOne({trackedBy: trackerId, trackingTo: trackingId}) 

    if(!trackDoc){
        const track = await Track.create({
            trackingTo: trackingId, 
            trackedBy: trackerId, 
        })

        const newTrack = await Track.findById(track._id) 
        if(!newTrack){
            throw new ApiError(404, 'Something went wrong while creating the track!')
        }

        return res
        .status(200)
        .json(new ApiResponse(200, newTrack, 'User Tracked!'))
    }
    else{
        await Track.findByIdAndDelete(trackDoc._id) 

        return res
        .status(200)
        .json(new ApiResponse(200, {}, 'User Untracked!'))
    }
})

const getLoggedInTrackers = asyncHandler(async(req, res)=>{
    const loggedInUser = req.user?._id 

    const tracks = await Track.find({trackingTo: loggedInUser}) 

    if (!tracks) {
        throw new ApiError(404, 'Something went wrong while fetching the loggedIn trackers!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tracks.length, 'Trackers of loggedIn user!'))
})

const getLoggedInTrackings = asyncHandler(async(req, res)=>{
    const loggedInUser = req.user?._id 

    const tracks = await Track.find({trackedBy: loggedInUser}) 

    if (!tracks) {
        throw new ApiError(404, 'Something went wrong while fetching the loggedIn Trackings')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tracks.length, 'Trackings of loggedIn User!'))
})

const getTrackers = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    const trackers = await Track.find({trackingTo: userId}) 

    if(!trackers){
        throw new ApiError(404, 'something went wrong while fetching trackers!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, trackers.length, 'total trackers of this user!'))
})

const getTrackings = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    const trackings = await Track.find({trackedBy: userId}) 

    if(!trackings){
        throw new ApiError(404, 'something went wrong while fetching trackings!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, trackings.length, 'total trackings of this user!'))
})

const getTrack = asyncHandler(async(req, res)=>{
    const {userId} = req.params 
    const loggedInUserId = req.user?._id

    const track = await Track.findOne({trackedBy: loggedInUserId, trackingTo: userId}) 

    if (!track) {
        return res
        .status(200)
        .json(new ApiResponse(200, false, 'Not Tracked!'))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, true, 'Tracked!'))
})

export {toggleTracking, getLoggedInTrackers , getLoggedInTrackings, getTrackers, getTrackings, getTrack}