import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshToken = async ( userId ) => {
    try {
    
        const user = await User.findOne(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(400,"can not generate access Token.");
    }
}
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

const loginUser = asyncHandler ( async ( req, res) => {
    const { username, password } = req.body || {};

    if ( !username && !password ) {
        throw new ApiError(400,"All feild are required.");
    }

    const userExist = await User.findOne({username});

    if ( !userExist ) {
        throw new ApiError(400,"username not registerd.");
    }

    const isPassword = await userExist.isPasswordCorrect(password);

    if ( !isPassword ) {
        throw new ApiError(401,"password is worng.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExist._id);

    const userLogged = await User.findById(userExist._id).select("-password -refreshToken");

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(200,{user:userLogged,accessToken,refreshToken},"user login successfully.")
    )
})

const logoutUser = asyncHandler ( async ( req, res)=> {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("refreshToken",option)
    .cookie("accessToken",option)
    .json(
        new ApiResponse(200,{},"User logout successfully.")
    )
})

const changePassword = asyncHandler ( async ( req, res ) => {
    const { oldPassword, newPassword } = req.body || {};

    if ( !oldPassword && !newPassword ) {
        throw new ApiError(400,"all feilds are required.");
    }

    const user = await User.findById(req.user?._id);

    if ( !user ) {
        throw new ApiError(401,"user can not find!")
    }

    const isPassword = await user.isPasswordCorrect(oldPassword);

    if ( !isPassword ) {
        throw new ApiError(400,"old password is worng.");
    }


    user.password = newPassword;
    await user.save({validateBeforeSave:false});
     
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"user successfully cahange password.")
    )
    
})

const changeUserDetails = asyncHandler ( async (req, res) => {
    const { username, email } = req.body || {};

    if ( !username || !email ) {
        throw new ApiError(400,"are feild are required.");
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username,
                emial: email
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"user details are updates.")
    )
})

const changeAvatar = asyncHandler (async ( req ,res ) => {
    const avatarLocalPath = req.files?.path;

    if ( !avatarLocalPath ) {
        throw new ApiError(400,"avatar is missing.");
    }

    const currentUser = await User.findById(req.user?._id);

    const deleteFromCloudinary = await deleteFromCloudinary(currentUser.avatar.split("/").pop().split(".")[0]);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar is update successfully.")
    )
})
export { 
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    changeUserDetails,
    changeAvatar
};