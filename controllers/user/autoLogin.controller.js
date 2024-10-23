import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const autoLoginController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    return res.status(e.OK.code).json({
      message: e.OK.message,
      success: true,
      user
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: false,
      error: error.message ? error.message : null,
    });
  }
};
