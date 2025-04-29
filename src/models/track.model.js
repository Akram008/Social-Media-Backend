import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
    {
        trackingTo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true 
        }, 
        trackedBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        }
    }, {timestamps: true}
)

export const Track = mongoose.model('Track', trackSchema)