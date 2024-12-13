import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import bcrypt from "bcryptjs";

const specialCharacterPattern = /[!@#$%^&*()\-=+:;<>\.~`|?/{}\[\],]/;

export const signupController = async (req, res) => {
  try {
    const { userName, userId, password, confirmPassword } = req.body;
    if (!userName || !userId || !password || !confirmPassword) {
      return res
        .status(e.BAD_REQUEST.code)
        .json({ message: "Empty fields are not allowed!", success: false });
    }
    if (password !== confirmPassword) {
      return res
        .status(e.BAD_REQUEST.code)
        .json({ message: "Password didn't matched!", success: false });
    }
    const user = await User.findOne({ userId });
    if (user) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "User already exists with this user ID! Try a different one.",
        success: false,
      });
    }
    if (userName.length > 16) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "Username can't exceed 16 characters.",
        success: false,
      });
    }
    if (userName.length < 4) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "Username can't be less than 4 characters.",
        success: false,
      });
    }
    if (specialCharacterPattern.test(userName)) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "Username can't contain special characters i.e:@,$,#...",
        success: false,
      });
    }
    if (userId.length > 16) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "userId can't exceed 16 characters.",
        success: false,
      });
    }
    if (userId.length < 4) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "userId can't be less than 4 characters.",
        success: false,
      });
    }
    if (specialCharacterPattern.test(userId)) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "userId can't contain special characters i.e:@,$,#...",
        success: false,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      userName,
      userId:`@${userId}`,
      password: encryptedPassword,
    });
    return res.status(e.OK.code).json({
      message: "User created successfully!",
      success: true,
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message ? error.message : "Unknown error occured!",
      success: false,
    });
  }
};
