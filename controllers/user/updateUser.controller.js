import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mediaDB from "../../database/cloudinary.js";

export const updateUserController = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      avatar,
      isPrivate,
      gender,
      dateOfBirth,
    } = req.body;

    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
      if (error) {
        return res.status(e.UNAUTHORIZED.code).json({
          message: "Invalid token",
          success: false,
        });
      }
      const UID = decode.userId;
      if (!UID) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Can't find the user credientials.",
          success: false,
        });
      }
      const user = await User.findById({ UID });
      if (!user) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User not found with the given token!",
          success: false,
        });
      }

      if (
        !userName &&
        !email &&
        !password &&
        !avatar &&
        !isPrivate &&
        !gender &&
        !dateOfBirth
      ) {
        return res.status(e.BAD_REQUEST.code).json({
          message: "No updated data provided!",
        });
      }

      if (userName && user.userName !== userName) {
        user.userName = userName.trim();
      }
      if (email && user.email !== email.trim()) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(e.CONFLICT.code).json({
            message: "User exixts with this email!",
            success: false,
          });
        }
        user.email = email.trim();
      }
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      if (avatar) {
        try {
          const uploadAvatarToCloudinary = await mediaDB(avatar);
          if (uploadAvatarToCloudinary) {
            user.avatar = uploadAvatarToCloudinary;
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
