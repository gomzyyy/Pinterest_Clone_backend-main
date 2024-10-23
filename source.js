import { signupController } from "./controllers/user/signup.controller.js";
import { loginController } from "./controllers/user/login.controller.js";
import { logoutController } from "./controllers/user/logout.controller.js";
import { updateUserController } from "./controllers/user/updateUser.controller.js";
import {
  postUploadController,
  deletePostController,
} from "./controllers/Post/post.controller.js";
import { postActionsController } from "./controllers/Post/postUpdationController.js";
import { serveStaticData } from "./controllers/getData/serveStaticData.js";
import { authorise } from "./middlewares/authentication.js";
import { servePosts } from "./controllers/getData/servePosts.js";

export {
  signupController,
  loginController,
  logoutController,
  updateUserController,
  postUploadController,
  deletePostController,
  postActionsController,
  serveStaticData,
  servePosts,
  authorise
};
