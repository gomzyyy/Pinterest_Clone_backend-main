import { User } from "../../models/userModel/user.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import mongoose from "mongoose";

export const getUserController = async (req, res) => {
  try {
    const admin = req.user;
    const { userId } = req.params;
    if (!admin) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Token not found!",
        success: false,
      });
    }
    if (!userId) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Can't find the userID!",
        success: false,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Invalid User ID format!",
        success: false,
      });
    }
    const user = await User.findById(userId).populate(["posts", "followers", "following"]);
    if (!user) {
      return res.status(e.NOT_FOUND.code).json({
        message: "User not found in the database!",
        success: false,
      });
    }
    return res.status(e.OK.code).json({
      message: "User found!",
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message ? error.message : "Unknown error occured!",
      success: false,
    });
  }
};
