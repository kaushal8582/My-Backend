import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
}


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

  const existedUser = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  const avtarLocalPath = req.files?.avtar[0]?.path
  let coverImageLocalPath;

  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is required ");
  }

  const avtar = await uploadOnCloudinary(avtarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avtar) {
    throw new ApiError(400, "Avtar file is required ");
  }

  const user = await User.create({
    fullName,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wront while rejister the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User rejister successfully ")
  )

})


const loginUser = asyncHandler(async (req, res) => {

  // my todo
  // user data (email or password) -> validate
  // checking rejister hai 
  // refres token , sab ko add kar denge
  // true -> login

  // chai or code todos
  // req body -> data
  // username or emal
  // find ther user
  // password check
  // access and refresh token
  // send cookie


  const { username, password, email } = req.body

  if (!username || !email) {
    throw new ApiError(400, "Username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User not rejister, Plz rejister")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    return new ApiError(401, "INvalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUSer = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUSer, accessToken, refreshToken
      },
        "User logged In successfully"
      )
    )
})

const logOut = asyncHandler(async (req, res) => {
  const userId = req.user._id
  await User.findByIdAndUpdate(
    userId, {
    $set: {
      refreshToken: undefined
    }
  },
    {
      new: true
    })

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logout successfully"));

})

export { rejisterUser, loginUser, logOut }