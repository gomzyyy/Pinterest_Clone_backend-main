import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { Post } from "../../models/userModel/postModel/post.model.js";

export const getAdminController = async (req, res) => {
  try {
    console.log("Requested");
    const user = req.user;
    // console.log(user)
    if (!user) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: "User not found!",
        success: false,
      });
    }

   // POSTS ALGO
    return res.status(e.OK.code).json({
      message: e.OK.message,
      success: true,
      admin: user
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: false,
    });
  }
};
// POST ALGO
 // const adminPosts = await Promise.all(
    //   user.posts.map(async (p) => {
    //     if (p) {
    //       const getAdminPosts = await Post.findById(p);
    //       if (!getAdminPosts) {
    //         console.error(`Post with ID: ${p} not found!`);
    //       }
    //       return getAdminPosts;
    //     } else {
    //       console.log("No Posts available in the server");
    //     }
    //   })
    // );

//

    // const bookmarkPosts = await Promise.all(
    //   user.bookmarks.map(async (b) => {
    //     if(b){
    //       const getAdminBookmarks = await Post.findById(b);
    //       if (!getAdminBookmarks) {
    //         console.error(`Bookmarked post with ID: ${b} not found!`);
    //       }
    //       return getAdminBookmarks;
    //     }else{
    //       console.log('No Posts available in the bookmarks')
    //     }

    //   })
    // );
