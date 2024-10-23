import { HTTP_STATUS_CODES as e } from "../staticData/errorMessages.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel/user.model.js";

export const authorise = async (req, res, next) => {
  try {
    console.log("requested")
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: "Unauthorised action!",
        success: false,
      });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
      if (error) {
        return res.status(e.BAD_GATEWAY.code).json({
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
      const user = await User.findById(UID);
      if (!user) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User not found with the given token!",
          success: false,
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: false,
      error: error.message ? error.message : null,
    });
  }
};
