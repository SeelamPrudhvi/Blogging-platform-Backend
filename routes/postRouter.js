const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

//Post Routs
router
  .route("/")
  .get(authController.verifyToken, postController.getAllPosts)
  .post(authController.verifyToken, postController.createPost);

router
  .route("/:id")
  .get(authController.verifyToken, postController.getPost)
  .put(authController.verifyToken, postController.updatePost)
  .delete(
    authController.verifyToken,
    authController.isAuthorized("post"),
    authController.restrictTo("admin", "user"),
    postController.deletePost
  );

module.exports = router;
