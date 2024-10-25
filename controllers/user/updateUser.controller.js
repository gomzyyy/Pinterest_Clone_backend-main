import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mediaDB from "../../database/cloudinary.js";

export const updateUserController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(e.NOT_FOUND.code).json({
        message: "User not found with the given token!",
        success: false,
      });
    }

    const {
      userName,
      password,
      isPrivate,
      gender,
      dateOfBirth,
      bio
    } = req.body;

    const avatar = req.file ? req.file.path : null;

    if (
      !userName &&
      !password &&
      !avatar &&
      !isPrivate &&
      !gender &&
      !dateOfBirth&&
      !bio
    ) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "No updated data provided!",
      });
    }

    if (userName && user.userName !== userName) {
      user.userName = userName.trim();
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if(bio && bio.trim()!==""){
      user.bio = bio.trim();
    }

    if (avatar && avatar.trim()!=="") {
      try {
        const uploadAvatarToCloudinary = await mediaDB(avatar);
        if (uploadAvatarToCloudinary) {
          user.avatar = uploadAvatarToCloudinary;
        }else{
          throw new Error("Upload failed!")
        }
      } catch (uploadError) {
        return res.status(e.UNPROCESSABLE_ENTITY.code).json({
          message:
            "Error occured while updating the profile image! please try later.",
          success: false,
          error: uploadError.message,
        });
      }
    }
    if (isPrivate !== undefined) {
      user.isPrivate = isPrivate;
    }
    if (gender) {
      user.gender = gender;
    }
    if (dateOfBirth) {
      user.dateOfBirth = dateOfBirth;
    }

    await user.save();
    return res.status(e.OK.code).json({
      message: "Profile updated successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "An error occurred while updating the profile.",
      success: false,
      error: error.message,
    });
  }
};
