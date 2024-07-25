import { Router } from "express";
import { 
  loginUser,
  logOut, 
  rejisterUser , 
  refreshAccessToken, 
  changeCurrentPassword, 
  getCurrentUser, 
  updateAccountDetails, 
  updateUserAvtar, 
  updateUserCoverImage, 
  getUserChannelProfile, 
  getWatchHistory
} from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.midlwware.js";


const router = Router()


router.route("/rejister").post(
  upload.fields([
    {
      name:"avtar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
    }
 ]),
  rejisterUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post( verifyJWT, logOut)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account-details").patch(verifyJWT,updateAccountDetails)
router.route("/update-avtar").patch(verifyJWT,upload.single("avtar"),updateUserAvtar)
router.route("/update-coverimg").patch(verifyJWT,upload.single("coverImg"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)


export default router
