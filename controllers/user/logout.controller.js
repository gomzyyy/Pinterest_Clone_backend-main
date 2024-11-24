import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const logoutController = async (req, res) => {
  try {
    // console.log("requested")
    const user = req.user;
    // console.log(user)
    if (!user) {
      return res.status(e.NOT_FOUND.code).json({
        message: "user not found!",
        success: false,
      });
    }
    return res.status(e.OK.code).json({
      message: "Logout success!",
      success: true,
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message ? error.message : "Unknown error occured!",
      success: false,
    });
  }
};
