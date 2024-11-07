import {
  Post,
  ReportPostModel,
} from "../../models/userModel/postModel/post.model.js";
import { Comment } from "../../models/userModel/postModel/commentModel/comment.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const postUpdationController = async (req, res) => {};

export const postActionsController = async (req, res) => {
  try {
    console.log("Updating");
    const { likes, getComment, reportPost, dislikes } = req.body;
    const { postId } = req.params;
    const user = req.user;

    if (!postId) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Post ID is required",
        success: false,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Post not found",
        success: false,
      });
    }

    if (
      likes === undefined &&
      !getComment &&
      !reportPost &&
      dislikes === undefined
    ) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "No data provided by the user!",
        success: false,
      });
    }

    if (likes !== undefined) {
      likes ? post.likes.addToSet(user._id) : post.likes.pull(user._id);
    }

    if (dislikes !== undefined) {
      dislikes ? post.dislikes.addToSet(user._id) : post.dislikes.pull(user._id);
    }

    if (getComment) {
      const trimmedComment = getComment.trim();
      if (!trimmedComment) {
        return res.status(e.UNPROCESSABLE_ENTITY.code).json({
          message: "Comment should not be empty!",
          success: false,
        });
      }
      if (trimmedComment.length > 120) {
        return res.status(e.UNPROCESSABLE_ENTITY.code).json({
          message: "Comment should not exceed 120 characters.",
          success: false,
        });
      }

      const newComment = new Comment({
        text: trimmedComment,
        admin: user._id,
      });
      await newComment.save();
      post.comments.push(newComment._id);
    }

    if (reportPost) {
      const report = new ReportPostModel({
        reportType: reportPost.reportType?.trim() || null,
        others: reportPost.others?.trim() || null,
      });
      post.reportStatus.push(report);
      await report.save();
      return res.status(e.OK.code).json({
        message: "Post reported!",
        success: true,
      });
    }

    await post.save();
    return res.status(e.OK.code).json({
      success: true,
      message: "Post updated!",
    });

  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "Unable to perform action.",
      success: false,
      error: error.message || "Unable to perform actions!",
    });
  }
};

