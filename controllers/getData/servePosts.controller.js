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
        posts: [],
      });
    }

    const peopleFollowedByAdmin = admin.following;

    if (peopleFollowedByAdmin.length === 0) {
      return res.status(404).json({
        message: "Admin didn't follow anyone.",
        success: false,
        posts: [],
      });
    }

    const postIdsByAdminFollowing = peopleFollowedByAdmin
      .map((p) => p.posts?.map((m) => m.toString()) || [])
      .flat();

    if (postIdsByAdminFollowing.length === 0) {
      return res.status(404).json({
        message: "No posts found from followed users.",
        success: false,
        posts: [],
      });
    }

    const postsByAdminFollowing = await Promise.all(
      postIdsByAdminFollowing.map((p) =>
        Post.findById(p).populate([
          "admin",
          "likes",
          "dislikes",
          { path: "comments", populate: { path: "admin" } },
        ])
      )
    );

    const newPosts = postsByAdminFollowing.filter(
      (f) => f.servedTo.includes(admin._id)
    );
    await Promise.all([
      newPosts.forEach((n) => {
        n.servedTo.push(admin._id);
        n.save();
      }),
    ]);

    const allPosts = await Post.find().populate(["admin","likes","dislikes"]);
    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({
        message: "No posts available.",
        success: false,
        posts: [],
      });
    }

    const filteredPosts = allPosts.filter(
      (p) => p.visible && p.reportStatus < 10
    );
    // if(allPosts)
    res.status(200).json({
      message: "Posts served successfully!",
      posts: allPosts,
      success: true,
    });
  } catch (error) {
    // console.error(error);
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
      posts: trendingPosts,
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

export const serveSearchedPostsByTags = async (req, res) => {
  try {
    const admin = req.user;
    const { tag } = req.params;
    if (!admin) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    if (!tag) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Not enough data provided to perform the action.",
        success: false,
      });
    }
    if (tag.trim()[0] === "#") {
      if (tag.slice(1).trim().length !== 0) {
        console.log("Searching posts by tags");
        console.log(tag.slice(1));
        const allPosts = await Post.find({
          tags: {
            $regex: `^${query.slice(1)}`,
            $options: "i",
          },
        });
        if (!allPosts) {
          return res.status(e.NOT_FOUND.code).json({
            message: "Can't find the posts from the database.",
            success: false,
          });
        }
        const adminPostIds = admin.posts.map((m) => m._id.toString());
        const allPostsExcludingAdminPosts = allPosts.filter(
          (p) => !adminPostIds.includes(p._id.toString())
        );
        return res.status(e.OK.code).json({
          message: "Request accepted.",
          success: true,
          data: {
            result: allPostsExcludingAdminPosts,
            type: "Post",
          },
        });
      }
    }

    return res.status(e.NO_CONTENT.code).json({
      message: "No results.",
      success: false,
      data: {
        result: [],
      },
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unknown server error occurred",
    });
  }
};

