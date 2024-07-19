import { Router } from "express";
import { loginUser, logOut, rejisterUser } from "../controllers/user.controller.js";

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


export default router
