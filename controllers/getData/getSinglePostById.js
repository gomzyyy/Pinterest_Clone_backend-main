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
      });
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
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
      });
    }
    if (!post.visits.includes(user._id)) post.visits.push(user._id);
    await post.save();
    return res.status(e.OK.code).json({
      message: e.OK.message,
      success: true,
      requestedPost: post,
      comments: allComments.reverse(),
      peopleLiked:post.likes,
      peopleDisliked:post.dislikes
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
