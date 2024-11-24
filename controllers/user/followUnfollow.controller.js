import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";

export const followUnfollowController = async (req, res) => {
  try {
    const user = req.user;
    const { isFollowedId, isUnfollowedId } = req.body;

    if (!isFollowedId && !isUnfollowedId) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "No data provided to perform any action!",
        success: false,
      });
    }

    if (isFollowedId) {
      const userFollowed = await User.findById(isFollowedId)
        .select("-otp")
        .populate(["posts", "followers", "following"]);

      if (!userFollowed) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User not found!",
          success: false,
        });
      }

      if (
        !user.following.some((f) => f._id.toString() === isFollowedId) &&
        !userFollowed.followers.some(
          (f) => f._id.toString() === user._id.toString()
        )
      ) {
        // console.log("Adding follow relationship...");
        user.following.push({ _id: isFollowedId });
        userFollowed.followers.push({ _id: user._id });
      } else {
        // console.log("User is already being followed.");
      }

      await Promise.all([user.save(), userFollowed.save()]);

      return res.status(e.OK.code).json({
        message: "Successfully followed user.",
        success: true,
      });
    }

    if (isUnfollowedId) {
      const userUnfollowed = await User.findById(isUnfollowedId)
        .select("-otp")
        .populate(["posts", "followers", "following"]);

      if (!userUnfollowed) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User not found!",
          success: false,
        });
      }

      if (
        user.following.some((f) => f._id.toString() === isUnfollowedId) &&
        userUnfollowed.followers.some(
          (f) => f._id.toString() === user._id.toString()
        )
      ) {
        user.following = user.following.filter(
          (f) => f._id.toString() !== isUnfollowedId
        );
        userUnfollowed.followers = userUnfollowed.followers.filter(
          (f) => f._id.toString() !== user._id.toString()
        );
      } else {
        return res.status(e.NOT_MODIFIED.code).json({
          message: "Can't perform the action. User is not a follower.",
          success: false,
        });
      }

      await Promise.all([user.save(), userUnfollowed.save()]);

      return res.status(e.OK.code).json({
        message: "Successfully unfollowed user.",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message || "Unknown error occurred!",
      success: false,
    });
  }
};

export const removeFollower = async (req, res) => {
  try {
    const admin = req.user;
    // console.log(admin.followers);
    const { followerId } = req.body;
    // console.log(followerId)
    if (!followerId) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "No data provided to perform any action!",
        success: false,
      });
    }
    const userToRemove = await User.findById(followerId);
    if (!userToRemove) {
      return res.status(e.NOT_FOUND.code).json({
        message: "User not found!",
        success: false,
      });
    }
    const adminFollowerIds = admin.followers.map((a) => a._id.toString());

    if (adminFollowerIds.includes(followerId)) {
      const admin1 = await User.findById(admin._id);
      if (!admin1) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Admin not found",
          success: false,
        });
      }
      admin1.followers.pull(userToRemove._id);
      userToRemove.following.pull(admin1._id);
      await Promise.all([admin1.save(), userToRemove.save()]);
      return res.status(e.OK.code).json({
        message: "Friend removed from the followers.",
        success: true,
      });
    } else {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Can't perform the action.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message || "Unknown error occurred!",
      success: false,
    });
  }
};
