import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const logoutController = async (req, res) => {
  try {
    console.log("requested")
    const user = req.user;
    console.log(user)
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
    console.log(error);
  }
};
