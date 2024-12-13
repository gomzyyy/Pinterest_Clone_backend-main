import { User, History, UserHistory, TagHistory } from "../../models/userModel/user.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const serveHistoryController = async (req, res) => {
  try {
    const admin = req.user;
    if (admin.history) {
      const history = await History.findById(admin.history).populate([{path:"users",populate:{path:"user"}}]);
      return res.status(e.OK.code).json({
        message: "history served!",
        success: true,
        history,
      });
    } else {
      return res.status(e.NOT_FOUND.code).json({
        message: "No history!",
        success: true,
        history: null,
      });
    }
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message || "Unknown error occurred!",
      success: false,
    });
  }
};
export const deleteSpecificHistoryController = async (req, res) => {
  try {
    const admin = req.user;
    const { userHistoryId, tagHistoryId } = req.body;

    if (!userHistoryId && !tagHistoryId) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Can't perform the action. Missing IDs.",
        success: false,
      });
    }

    if (!admin.history) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Can't find any history.",
        success: false,
      });
    }

    const adminHistory = await History.findById(admin.history);
    if (!adminHistory) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Can't find any history.",
        success: false,
      });
    }

    if (userHistoryId) {
      const deletedUserHistory = await UserHistory.findByIdAndDelete(userHistoryId);
      if (!deletedUserHistory) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User history not found.",
          success: false,
        });
      }

      await History.findByIdAndUpdate(admin.history, {
        $pull: { users: userHistoryId },
      });

      return res.status(e.OK.code).json({
        message: "User history updated successfully.",
        success: true,
      });
    }

    if (tagHistoryId) {
      const deletedTagHistory = await TagHistory.findByIdAndDelete(tagHistoryId);
      if (!deletedTagHistory) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Tag history not found.",
          success: false,
        });
      }

      await History.findByIdAndUpdate(admin.history, {
        $pull: { tags: tagHistoryId },
      });

      return res.status(e.OK.code).json({
        message: "Tag history updated successfully.",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message || "Unknown error occurred!",
      success: false,
    });
  }
};

export const deleteAllHistoryController = async (req, res) => {
  try {
    const admin = req.user;
    if (admin.history) {
      await History.findByIdAndDelete(admin.history);
      admin.history = null;
     await admin.save();
     return res.status(e.OK.code).json({
        message: "History deleted successfully!",
        success: true,
      });
    } else {
      return res.status(e.NOT_FOUND.code).json({
        message: "Admin don't have any history.",
        success: false,
      });
    }
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message || "Unknown error occurred!",
      success: false,
    });
  }
};
