import asyncHandler from "../utils/asyncHandler.js";

const rejisterUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    message:"Ok kaushal"
  })
})

export {rejisterUser}