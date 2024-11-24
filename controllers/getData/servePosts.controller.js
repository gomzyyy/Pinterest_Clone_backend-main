import { Post } from "../../models/userModel/postModel/post.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const servePosts = async (req, res) => {
  try {
    const admin = req.user;
    const peopleFollowedByAdmin = admin.following;
    const postIdsByAdminFollowing = peopleFollowedByAdmin.map((p) => p.posts.map((m)=>m.toString()));
    const postsByAdminFollowing = await Promise.all(
      postIdsByAdminFollowing[0].map((p) =>{
       return Post.findById(p).populate("admin")})
    );

    const allPosts = await Post.find().populate("admin");
    if (!allPosts) {
      return res.status(e.NOT_FOUND.code).json({
        message: "No posts available.",
        success: false,
      });
    }
    const filteredPosts = allPosts.filter((p) => {
      return p.visible && p.reportStatus < 10;
    });
    res.status(e.OK.code).json({
      message: "Posts served success!",
      posts: postsByAdminFollowing,
      success: true,
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "Can't react the server.",
      success: false,
      error:
        error instanceof Error
          ? error.message
          : e.INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const serveTrendingPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().populate("admin");
    if (!allPosts) {
      return res.status(e.NOT_FOUND.code).json({
        message: "No posts available.",
        success: false,
      });
    }
    const mostLikedPosts = [...allPosts].sort(
      (a, b) => b.likes.length - a.likes.length
    );
    const mostVisitedPosts = [...allPosts].sort(
      (a, b) => b.visits.length - a.visits.length
    );
    const mostCommentedPost = [...allPosts].sort(
      (a, b) => b.comments.length - a.comments.length
    );

    const trendingPosts = allPosts.filter((a) => {
      if (allPosts.length > 800) {
        if (
          mostLikedPosts.slice(0, 401).includes(a) &&
          mostCommentedPost.slice(0, 401).includes(a) &&
          mostVisitedPosts.slice(0, 401).includes(a)
        ) {
          return a;
        } else {
          if (
            mostLikedPosts.includes(a) &&
            mostCommentedPost.includes(a) &&
            mostVisitedPosts.includes(a)
          ) {
            return a;
          }
        }
      }
    });

    res.status(e.OK.code).json({
      message: "Posts served success!",
      posts: filteredPosts,
      success: true,
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "Can't react the server.",
      success: false,
      error:
        error instanceof Error
          ? error.message
          : e.INTERNAL_SERVER_ERROR.message,
    });
  }
};
