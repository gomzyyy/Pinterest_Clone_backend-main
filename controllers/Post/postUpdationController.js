import {
  Post,
  ReportPostModel,
} from "../../models/userModel/postModel/post.model.js";
import { Comment } from "../../models/userModel/postModel/commentModel/comment.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const postUpdationController =async(req, res)=>{
  
}



export const postActionsController = async (req, res) => {
  try {
    const { likes, getcomment, reportPost, dislikes } = req.body;
    const { postId } = req.params;
    const user = req.user;
    const post = await Post.findById(postId);
    if (likes !== undefined) {
      if (likes === true) {
        post.likes.push(user._id);
      } else {
        post.likes.pull(user._id);
      }
    }
    if (dislikes !== undefined) {
      if (dislikes === true) {
        post.dislikes.push(user._id);
      } else {
        post.dislikes.pull(user._id);
      }
    }
    if (getcomment) {
      if (getcomment.trim() === "") {
        return res.status(e.UNPROCESSABLE_ENTITY.code).json({
          message: "Comment should not be empty!",
          success: false,
        });
      }
      if (getcomment.trim().length > 120) {
        return res.status(e.UNPROCESSABLE_ENTITY.code).json({
          message: "Comment should not exceed 120 characters.",
          success: false,
        });
      }
      const newComment = new Comment({
        text: getcomment,
        admin: user._id,
      });
      post.comments.push(newComment);
    }
    if (reportPost) {
      const report = new ReportPostModel({
        reportType:
          reportPost.reportType.trim() !== "" ? reportPost.reportType : null,
        others: reportPost.others.trim() !== "" ? reportPost.others : null,
      });
      post.reportStatus.push(report);
      return res.status(e.OK.code).json({
        message: "Post reported!",
        success: true,
      });
    }

    await post.save();
    return res.status(e.OK.code).json({
      success: true,
      message:"Post updated!"
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "Unable to perform action.",
      success: false,
      error: error.message,
    });
  }
};
