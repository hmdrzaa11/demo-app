let router = require("express").Router();
let { protectRoutes } = require("../controllers/userController");
let postController = require("../controllers/postController");

router.post(
  "/",
  protectRoutes,
  postController.upload,
  postController.createPost
);

router.get("/", postController.getAllPosts);

router.patch(
  "/:postId",
  protectRoutes,
  postController.upload,
  postController.editPost
);

module.exports = router;
