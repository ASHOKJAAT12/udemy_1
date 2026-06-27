import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler ( async ( req, res) => {
    const {username, email, password} = req.body || {};

    if ( !username && !email && !password ) {
        throw new ApiError(400,"All feild are required.");
    }

    const userExist = await User.findOne({
        $or: [{email},{username}]
    })

    if ( userExist ) {
        throw new ApiError(401,"username and email Already regsiterd.");
    }

    const avatrLocalPath = req.files?.path;

    if ( !avatrLocalPath ) {
        throw new ApiError(400,"avatar is missing.");
    }

    const avatar = await uploadOnCloudinary(avatrLocalPath);

    const user = await User.create({
        username: username.toLowerCase(),
        password: password,
        email: email.toLowerCase(),
        avatar: avatar.url
    })

    if ( !user ) {
        throw new ApiError(400,"user not created.");
    }

    const userRegister = await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(201)
    .json(
        new ApiResponse(200,userRegister,"user Register successfully.")
    )

})

export { registerUser};