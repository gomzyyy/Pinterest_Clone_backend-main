import { Router } from "express";
import {
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
} from "../source.js";
import { upload } from "../middlewares/multer.js";

const route = Router();

// creating data

route.post("/signup", signupController);
route.post("/login", loginController);
route.post("/user/logout", authorise,logoutController);
route.post(
  "/user/profile/update",
  upload.single("avatar"),authorise,
  updateUserController
);
route.post("/user/upload", upload.single("post"), authorise, postUploadController);
route.post("/user/posts/delete/:postId", authorise, deletePostController);
route.post("/user/posts/post/update/:postId", authorise, postActionsController)

// serving data 

route.get("/user/get-posts", authorise, servePosts)
route.get("/user/get/:dataType", authorise, serveStaticData)

export default route;
