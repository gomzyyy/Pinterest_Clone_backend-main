import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import { set } from "mongoose";
import { Post } from "../../models/userModel/postModel/post.model.js";

const specialCharacterPattern = /[!@#$%^&*()\-=+:;<>\.~`|?/{}\[\],]/;

export const servePremiumUsers = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    const allUsers = await User.find();
    const premiumUsers = allUsers.filter((u) => {
      if (!u.verified) return;
      return u;
    });
    return res.status(e.OK.code).json({
      message: e.OK.message,
      success: true,
      premiumUsers,
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: true,
      error:
        error instanceof Error
          ? error.message
          : "An unknown server error occurred",
    });
  }
};
export const serveAllUsers = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    const getAllUsers = await User.find().populate([
      "following",
      "followers",
      "posts",
    ]);
    const allUsersExcludingMe = getAllUsers.filter(
      (g) => g._id.toString() !== user._id.toString()
    );
    const filteredSuggestions = allUsersExcludingMe.filter(
      (f) => !user.followers.includes(f._id) && !user.following.includes(f._id)
    );

    //   const filteredSuggestionsId = allUsersExcludingMe
    //   .filter(
    //     (f) =>
    //       !user.followers.includes(f._id) && !user.following.includes(f._id)
    //   )
    //   .map((i) => String(i._id));

    // const adminFollowingIds = user.map(
    //   (i = i.following.map((g) => String(g._id)))
    // );

    // const UsersNotIncludedInAdminFollowing =
    //   filteredSuggestions.filter((s) => !user.following.includes(s));

    // const sId = suggestedUsersNotIncludedInAdminFollowing.map((s)=>{
    //  return s.userName
    // })
    // console.log(sId)

    return res.status(e.OK.code).json({
      message: e.OK.message,
      success: true,
      data: {
        allUsers: filteredSuggestions,
        getAllUsers,
      },
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: e.INTERNAL_SERVER_ERROR.message,
      success: true,
      error:
        error instanceof Error
          ? error.message
          : "An unknown server error occurred",
    });
  }
};

export const serveSuggestedUsers = async (req, res) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    // console.log(admin)

    const allUsers = await User.find();
    if (!allUsers) {
      return res.status(e.NOT_FOUND.code).json({
        message: "Error occured while getting the users from the database.",
        success: false,
        data: {
          suggestedUsers: [],
        },
      });
    }
    const allUsersExcludingMe = allUsers.filter(
      (a) => a._id.toString() !== admin._id.toString()
    );
    // console.log(allUsersExcludingMe)
    let suggestions = new Set();

    if (admin.following.length !== 0 || admin.followers.length !== 0) {
      // console.log("12344");
      const adminFollowingIds = admin.following.map((m) => m._id.toString());
      const adminFollowerIds = admin.followers.map((m) => m._id.toString());
      if (admin.following.length > 0) {
        admin.following.forEach((u) => {
          u.following.forEach((i) => {
            !adminFollowingIds.includes(i.toString()) &&
              suggestions.add(i.toString());
          });
        });
      }

      if (admin.followers.length > 0) {
        admin.followers.forEach((user) => {
          user.following.forEach((followedUserId) => {
            !adminFollowerIds.includes(followedUserId.toString()) &&
              suggestions.add(followedUserId.toString());
          });
        });
      }

      const uniqueSuggestionsArray = Array.from(suggestions);
      // console.log(uniqueSuggestionsArray);

      const populatedUsers = await Promise.all(
        uniqueSuggestionsArray.map(async (i) => {
          try {
            return await User.findById(i)
              .select(["-otp", "-password"])
              .populate(["posts", "followers", "following"]);
          } catch (error) {
            console.error(
              `Error fetching user with ID ${i.toString()}:`,
              error
            );
            return null;
          }
        })
      );

      const validPopulatedUsers = populatedUsers
        .filter((user) => user !== null)
        .filter(
          (user, index, self) =>
            index ===
            self.findIndex((u) => u._id.toString() === user._id.toString())
        );
      const ValidPopulatedUsersExcludingAdmin = validPopulatedUsers.filter(
        (u) =>
          u._id.toString() !== admin._id.toString() &&
          !adminFollowerIds.includes(u._id.toString()) &&
          !adminFollowingIds.includes(u._id.toString())
      );
      if (
        ValidPopulatedUsersExcludingAdmin !== null &&
        ValidPopulatedUsersExcludingAdmin.length > 0
      ) {
        return res.status(e.OK.code).json({
          message: e.OK.message,
          success: true,
          data: {
            suggestedUsers: ValidPopulatedUsersExcludingAdmin,
          },
        });
      } else {
        return res.status(e.OK.code).json({
          message: e.OK.message,
          success: true,
          data: {
            suggestedUsers: [],
          },
        });
      }
    } else {
      return res.status(e.OK.code).json({
        message: e.OK.message,
        success: true,
        data: {
          suggestedUsers: allUsersExcludingMe,
        },
      });
    }
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

export const serveSearchSuggestions = async (req, res) => {
  try {
    const admin = req.user;
    const { query } = req.params;
    if (!admin) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: e.UNAUTHORIZED.message,
        success: false,
      });
    }
    if (!query) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Not enough data provided to perform the action.",
        success: false,
      });
    }
    if (query[0] === "#") {
      const allPosts = await Post.find({ tags: query });
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
    if (query[0] === "@") {
      const allUsers = await User.find({ userId: query }).limit(30);
      if (!allUsers) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Can't find the posts from the database.",
          success: false,
        });
      }
      const allUsersExcludingAdmin = allUsers.filter(
        (a) => a._id.toString() !== admin._id.toString()
      );
      return res.status(e.OK.code).json({
        message: "Request accepted.",
        success: true,
        data: {
          result: allUsersExcludingAdmin,
          type: "User",
        },
      });
    }
    if (!specialCharacterPattern.test(query)) {
      const allUsers = await User.find({ userName: query }).limit(30);
      if (!allUsers) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Can't find the posts from the database.",
          success: false,
        });
      }
      const allUsersExcludingAdmin = allUsers.filter(
        (a) => a._id.toString() !== admin._id.toString()
      );
      return res.status(e.OK.code).json({
        message: "Request accepted.",
        success: true,
        data: {
          result: allUsersExcludingAdmin,
          type: "User",
        },
      });
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
