let router = require("express").Router();
let { protectRoutes } = require("../controllers/userController");
let postController = require("../controllers/postController");

router.post(
  "/",
  protectRoutes,
  postController.upload,
  postController.createPost
);

module.exports = router;
