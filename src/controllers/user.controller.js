import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { User } from './../models/user.model';
import {ApiResponse} from "../utils/ApiRespone.js";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation - cnot empty
    // check if user already exists user name or email
    // check for image , check for avatar
    //upload them to clouninaary, avatar
    // crate user object - create user in db
    // check for user creation
    // return response

    const { fullName, email, username, password } = req.body
    console.log(fullName, email, username, password);
    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }


    User.findOne({ $or: [{ email }, { username }] })
        .then(user => {
            if (user) {
                throw new ApiError(400, "User already exists with this email or username");
            }
            const newUser = new User({ fullName, email, username, password });
            return newUser.save();
        })
        .then(savedUser => {
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    id: savedUser._id,
                    fullName: savedUser.fullName,
                    email: savedUser.email,
                    username: savedUser.username
                }
            });
        })
        .catch(err => {
            throw new ApiError(500, err.message || "Internal Server Error");
        });

        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar are required");
        }

     const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars")
     const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImages");

     if(!avatar){
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
     }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
     })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

});

export { registerUser };
