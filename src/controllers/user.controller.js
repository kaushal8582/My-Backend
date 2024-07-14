import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const rejisterUser = asyncHandler(async (req, res, next) => {
  // get user details from fromted
  // validation - not empty
  // check if user already exists: username,email
  //check for image , check for avtar
  //upload then to cloudinary
  //create user object  -  creation entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response


  const { fullName, email, username, password } = req.body


  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = User.findOne({
    $or: [{ email }, { username }]
  })

  if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
  }

  const avtarLocalPath = req.files?.avtar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if(!avtarLocalPath){
    throw new ApiError(400,"Avtar file is required ");
  }

  const avtar =  await uploadOnCloudinary(avtarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avtar){
    throw new ApiError(400,"Avtar file is required ");
  }
  


  const user = await User.create({
    fullName,
    avtar:avtar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser =  await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wront while rejister the user");
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User rejister successfully ")
  )

})

export { rejisterUser }