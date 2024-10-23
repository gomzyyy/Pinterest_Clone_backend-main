import { Post } from "../../models/userModel/postModel/post.model.js";
import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";

export const servePosts = async (req, res) => {
  try {
    console.log("requested")
    const posts = await Post.find().populate('admin');
    if (!posts) {
      return res.status(e.NOT_FOUND.code).json({
        message: "No posts available.",
        success: false,
      });
    }
    const filteredPosts = posts.filter((p) => {
      return p.visible && p.reportStatus < 10;
    });
    res.status(e.OK.code).json({
      message: "Posts served success!",
      data: filteredPosts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
