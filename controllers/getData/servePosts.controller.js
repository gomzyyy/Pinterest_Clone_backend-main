import { Post } from "../../models/userModel/postModel/post.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const servePosts = async (req, res) => {
  try {
    console.log("Serving posts...");
    const admin = req.user;

    if (!admin || !Array.isArray(admin.following)) {
      return res.status(400).json({
        message: "Admin data is invalid or missing.",
        success: false,
        posts: []
      });
    }

    const peopleFollowedByAdmin = admin.following;

    if (peopleFollowedByAdmin.length === 0) {
      return res.status(404).json({
        message: "Admin didn't follow anyone.",
        success: false,
        posts: []
      });
    }

    const postIdsByAdminFollowing = peopleFollowedByAdmin.map((p) =>
      p.posts?.map((m) => m.toString()) || []
    ).flat();  // Flatten the array of arrays

    if (postIdsByAdminFollowing.length === 0) {
      return res.status(404).json({
        message: "No posts found from followed users.",
        success: false,
        posts: []
      });
    }

    const postsByAdminFollowing = await Promise.all(
      postIdsByAdminFollowing.map((p) => Post.findById(p).populate(["admin","likes","dislikes",{path:"comments",populate:{path:"admin"}}]))
    );

    const allPosts = await Post.find().populate("admin");
    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({
        message: "No posts available.",
        success: false,
        posts: []
      });
    }

    const filteredPosts = allPosts.filter((p) => p.visible && p.reportStatus < 10);
// console.log(postsByAdminFollowing)
    res.status(200).json({
      message: "Posts served successfully!",
      posts: postsByAdminFollowing,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Can't reach the server.",
      success: false,
      posts: [],
      error: error.message || "Internal Server Error",
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
