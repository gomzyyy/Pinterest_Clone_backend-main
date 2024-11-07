import { Router } from "express";
import {
  signupController,
  loginController,
  logoutController,
  updateUserController,
  postUploadController,
  deletePostController,
  postActionsController,
  getAdminController,
  getPostByIdController,
  postUpdationController,
  serveStaticData,
  servePosts,
  authorise,
  autoLoginController,
} from "../source.js";
import { upload } from "../middlewares/multer.js";

const route = Router();

// creating data

route.post("/signup", signupController);
route.post("/login", loginController);
route.post("/user/logout", authorise, logoutController);
route.post(
  "/user/profile/update",
  upload.single("avatar"),
  authorise,
  updateUserController
);
route.post(
  "/user/upload",
  upload.single("post"),
  authorise,
  postUploadController
);
route.post("/user/post/delete/:postId", authorise, deletePostController);
route.post("/user/post/actions/:postId", authorise, postActionsController);

// serving data

route.get("/user/get-posts", authorise, servePosts);
route.get("/user/post/get-post/:postId", authorise, getPostByIdController);
route.get('/user/profile/get-user', authorise, getAdminController)
route.get('/check-user', authorise, autoLoginController)
route.get("/user/get/:dataType", authorise, serveStaticData);

export default route;
