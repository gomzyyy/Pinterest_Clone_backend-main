import {
  Post,
  ReportPostModel,
} from "../../models/userModel/postModel/post.model.js";
import { Comment } from "../../models/userModel/postModel/commentModel/comment.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const postUpdationController = async (req, res) => {};

export const postActionsController = async (req, res) => {
  try {
    const { postLiked, postUnLiked, getComment, reportPost, dislikes } =
      req.body;
    const { postId } = req.params;
    const admin = req.user;
    console.log("postLiked: ", postLiked, "postUnLiked: ", postUnLiked);
    if (!postId) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Post ID is required",
        success: false,
      });
    }

    const post = await Post.findById(postId); // yaha pe ayi

    if (!post) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Post not found",
        success: false,
      });
    }
    // console.log(postLiked, postUnLiked);
    // console.log(post);
    // console.log(allLikes);

    if (
      !postLiked &&
      !postUnLiked &&
      !getComment &&
      !reportPost &&
      dislikes === undefined
    ) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "No data provided by the user!",
        success: false,
      });
    }

    if (postLiked && postUnLiked) {
      return res.status(e.CONFLICT.code).json({
        message: "Can't perform alternate actions simultaneously",
        success: false,
      });
    }
    if (postLiked || postUnLiked) {
      const allLikes = post.likes.map((m) => m.toString());

      if (postLiked) {
        console.log("lrnvjrvi");
        if (!allLikes.includes(admin._id.toString())) {
          post.likes.addToSet(admin._id);
          admin.likedPosts.addToSet(postId);
        }
      } else if (postUnLiked) {
        console.log("cjrehi");
        if (allLikes.includes(admin._id.toString())) {
          post.likes.pull(admin._id);
          admin.likedPosts.pull(postId);
        }
      }
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
        admin: admin._id,
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
    await Promise.all([admin.save(), post.save()]); // yaha pe save hori hai

    const updatedPost = await Post.findById(postId)
      .populate([
        { path: "admin" },
        {
          path: "comments",
          populate: { path: "admin" },
        },
        { path: "likes" },
        { path: "dislikes" },
      ])
      .exec();

    console.log(updatedPost);
    return res.status(e.OK.code).json({
      success: true,
      message: "Post updated!",
      post: updatedPost,
      data: {
        peopleLiked: post.likes,
        peopleDisliked: post.dislikes,
        comments: post.comments,
      },
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "Unable to perform action.",
      success: false,
      error: error.message || "Unable to perform actions!",
    });
  }
};
