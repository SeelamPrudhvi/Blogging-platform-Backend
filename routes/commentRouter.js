const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.verifyToken, commentController.getAllComments)
  .post(authController.verifyToken, commentController.createComment);

router
  .route("/:id")
  .get(authController.verifyToken, commentController.getComment)
  .put(authController.verifyToken, commentController.updateComment)
  .delete(
    authController.verifyToken,
    authController.isAuthorized("comment"),
    authController.restrictTo("admin", "user"),
    commentController.deleteComment
  );

module.exports = router;
