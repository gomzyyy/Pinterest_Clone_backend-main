import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { Post } from "../../models/userModel/postModel/post.model.js";
import { Comment } from "../../models/userModel/postModel/commentModel/comment.model.js";

export const getPostByIdController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
        post: [],
      });
    }
    const { postId } = req.params;
    if (!postId)
      return res.status(e.BAD_REQUEST.code).json({
        message: "Post ID not provided.",
        sucess: false,
        data: {
          post: [],
        },
      });
    const post = await Post.findById(postId).populate([
      "admin",
      { path: "comments", populate: { path: "admin" } },
      "likes",
    ]);
    const allComments = await Promise.all(
      post.comments.map(async (c) => {
        const populatedComment = Comment.findById(c._id).populate("admin");
        return populatedComment;
      })
    );
    if (!post) {
      return res.status(e.NOT_FOUND.code).json({
        message: e.NOT_FOUND.message,
        success: false,
        data: {
          post: [],
        },
      });
    }
    if (!post.visits.includes(user._id)) post.visits.push(user._id);
    await post.save();
    return res.status(e.OK.code).json({
      message: e.OK.message,
      success: true,
      data: {
        post,
      },
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: false,
      error: error?.message
        ? error.message
        : "Unknown error occured while fetching post.",
    });
  }
};
