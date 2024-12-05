import { HTTP_STATUS_CODES as e } from "../staticData/errorMessages.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel/user.model.js";
import { promisify } from "util";

export const authorise = async (req, res, next) => {
  try {
    // console.log("req")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: "Unauthorized action! Token missing or malformed.",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];
    const verifyToken = promisify(jwt.verify);

    let decoded;
    try {
      decoded = await verifyToken(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Invalid token",
        success: false,
      });
    }

    const UID = decoded?.userId;
    if (!UID) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Can't find the user credentials.",
        success: false,
      });
    }

    const user = await User.findById(UID)
      .select("-otp")
      .populate(["posts", "followers", "following"]);

    if (!user) {
      return res.status(e.NOT_FOUND.code).json({
        message: "User not found with the given token!",
        success: false,
      });
    }
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: false,
    });
  }
};
