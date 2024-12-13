import { signupController } from "./controllers/user/signup.controller.js";
import { loginController } from "./controllers/user/login.controller.js";
import { logoutController } from "./controllers/user/logout.controller.js";
import { updateUserController } from "./controllers/user/updateUser.controller.js";
import {
  postUploadController,
  deletePostController,
} from "./controllers/Post/post.controller.js";
import { followUnfollowController, removeFollower } from "./controllers/user/followUnfollow.controller.js";
import { getUserController,getUserAndSaveInHistoryController } from "./controllers/getData/getUser.controller.js";
import { postUpdationController } from "./controllers/Post/postUpdationController.controller.js";
import { postActionsController } from "./controllers/Post/postUpdationController.controller.js";
import { serveStaticData } from "./controllers/getData/serveStaticData.controller.js";
import { authorise } from "./middlewares/authentication.js";
import { servePosts,serveTrendingPosts,serveSearchedPostsByTags } from "./controllers/getData/servePosts.controller.js";
import { getAdminController } from "./controllers/getData/getAdmin.controller.js";
import { autoLoginController } from "./controllers/user/autoLogin.controller.js";
import { getPostByIdController } from "./controllers/getData/getSinglePostById.controller.js";
import {
  serveAllUsers,
  servePremiumUsers,
  serveSuggestedUsers,
  serveSearchSuggestions,
} from "./controllers/getData/serveUsers.controller.js";
import { serveHistoryController,deleteSpecificHistoryController,deleteAllHistoryController } from "./controllers/getData/history.controller.js";
export {
  getUserController,
  getUserAndSaveInHistoryController,
  signupController,
  loginController,
  logoutController,
  updateUserController,
  postUploadController,
  deletePostController,
  postActionsController,
  getAdminController,
  autoLoginController,
  getPostByIdController,
  serveStaticData,
  postUpdationController,
  followUnfollowController,
  removeFollower,
  serveAllUsers,
  servePremiumUsers,
  serveSuggestedUsers,
  serveTrendingPosts,
  serveSearchSuggestions,
  serveSearchedPostsByTags,
  servePosts,
  serveHistoryController,
  deleteSpecificHistoryController,
  deleteAllHistoryController,
  authorise,
};
