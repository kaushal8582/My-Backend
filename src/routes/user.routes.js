import { Router } from "express";
import { rejisterUser } from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router()


router.route("/rejister").post(
  upload.fields(
    {
      name:"avtar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
    }
  ),
  rejisterUser
)


export default router
