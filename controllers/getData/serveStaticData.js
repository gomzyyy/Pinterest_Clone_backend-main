import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import {
  CategoriesEnum,
  ReportCommentsEnum,
  ReportPostEnum,
  ReportUserEnum,
} from "../../staticData/constants.js";
export const serveStaticData = async (req, res) => {
  try {
    const { dataType } = req.params;
    if (!dataType) {
      return res.status(e.NO_CONTENT.code).json({
        message: "No specific type of data requested.",
        success: false,
      });
    }
    if (dataType === "post-categories") {
      return res.status(e.OK.code).json({
        message:'Data served!',
        data:CategoriesEnum,
        success:true
      })
    }
    if (dataType === "ReportComment") {
      return res.status(e.OK.code).json({
        message:'Data served!',
        data:ReportCommentsEnum,
        success:true
      })
    }
    if (dataType === "ReportPost") {
      return res.status(e.OK.code).json({
        message:'Data served!',
        data:ReportPostEnum,
        success:true
      })
    }
    if (dataType === "ReportUser") {
      return res.status(e.OK.code).json({
        message:'Data served!',
        data:ReportUserEnum,
        success:true
      })
    }
    return res.status(e.BAD_REQUEST.code).json({
      message: "invalid request!",
      success: false,
    });
  } catch (error) {
    console.log(error);
  }
};
