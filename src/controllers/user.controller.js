import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar ? req.files.avatar[0].path : null;
  // const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : null;


  let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage)  && req.files.coverImage.length > 0){
    
    coverImageLocalPath = req.files.coverImage[0].path;
   }
 
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  let avatar, coverImage;

  try {
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new apiError(500, "Error uploading avatar");
      }
    }

    if (coverImageLocalPath) {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
      if (!coverImage) {
        throw new apiError(500, "Error uploading cover image");
      }
    }

    const user = await User.create({
      fullName,
      avatar: avatar.url || "",
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createUser) {
      throw new apiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new apiResponse(200, createUser, "User registered successfully"));
  } catch (err) {
    console.error("Error during user registration:", err);
    throw new apiError(500, "Internal Server Error");
  }
});

export { registerUser };
