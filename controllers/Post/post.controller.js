import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import { Post } from "../../models/userModel/postModel/post.model.js";
import jwt from "jsonwebtoken";
import mediaDB from "../../database/cloudinary.js";

export const postUploadController = async (req, res) => {
  try {
    const { title, tags } = req.body;
    const imagePath = req.file.path;
    const user = req.user;
    if (!imagePath) {
      return res.status(404).json({
        message: "Media not found",
        success: false,
      });
    }
    if (!user) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Can't find the user credientials.",
        success: false,
      });
    }
    // if (!user.posts) {
    //   user.posts = [];
    // }
    console.log(imagePath);

    if (!title || !imagePath || !tags) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Some required fields are empty!",
        success: false,
      });
    }
    if (imagePath.trim() === "") {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Image is required!",
        success: false,
      });
    }
    let imageUrl;
    try {
      const uploadPostImageToCloudinary = await mediaDB(imagePath);
      if (uploadPostImageToCloudinary) {
        imageUrl = uploadPostImageToCloudinary;
      }
    } catch (uploadError) {
      console.log(uploadError);
      return res.status(e.INTERNAL_SERVER_ERROR.code).json({
        message: "An error occured while creating the post.",
        success: false,
        error: uploadError.message,
      });
    }
    if (imageUrl.trim() === "") {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Invalid image URL provided by the database!",
        success: false,
      });
    }
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const newPost = new Post({
      title: title.trim(),
      admin: user._id,
      image: imageUrl,
      tags: tagsArray,
    });
    await newPost.save();

   await user.posts.push(newPost._id);

    await user.save();
    return res.status(e.OK.code).json({
      message: "Post created success!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "An error occurred while creating post.",
      success: false,
      error: error.message,
    });
  }
};

export const deletePostController = async (req, res) => {
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
      if (error) {
        return res.status(e.UNAUTHORIZED.code).json({
          message: "Invalid token",
          success: false,
        });
      }
      const { postId } = req.params;
      const postOk = await Post.findById(postId);
      if (!postOk) {
        return res.status(e.BAD_REQUEST.code).json({
          message: "Can't find the post.",
          success: false,
        });
      }
      const UID = decode.userId;
      if (!UID) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Can't find the user credientials.",
          success: false,
        });
      }
      const user = await User.findById(UID);
      if (!user) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User not found with the given token!",
          success: false,
        });
      }
      const deletePost = await Post.findByIdAndDelete(postId);
      if (!deletePost) {
        return res.status(e.INTERNAL_SERVER_ERROR.code).json({
          message: "Unable to delete the post.",
          success: false,
        });
      }
      user.posts.pull(postId);
      await user.save();
      return res.status(e.OK.code).json({
        message: "Post deleted successfully!",
        success: true,
      });
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "An error occurred while deleting post.",
      success: false,
      error: error.message,
    });
  }
};
