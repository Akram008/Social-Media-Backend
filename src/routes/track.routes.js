import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLoggedInTrackers, getLoggedInTrackings, getTrack, getTrackers, getTrackings, toggleTracking } from "../controllers/track.controller.js";

const router = Router()

router.route('/trackUser/:trackingId').post(verifyJWT, toggleTracking)
router.route('/loggedInUserTrackers').get(verifyJWT, getLoggedInTrackers)
router.route('/loggedInUserTrackings').get(verifyJWT, getLoggedInTrackings)
router.route('/userTrackers/:userId').get(getTrackers)
router.route('/userTrackings/:userId').get(getTrackings)
router.route('/isTrack/:userId').get(verifyJWT, getTrack)

export default router 