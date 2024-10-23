import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const getAdminController = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user)
    if (!user) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    return res.status(e.OK.code).json({ 
        message: e.OK.message, 
        success: true,
        admin:user
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
        error
      });
  }
};
