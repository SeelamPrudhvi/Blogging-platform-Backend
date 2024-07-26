const { Comment } = require("../model/blogModel");
const appError = require("../middlewares/errorHandling");

exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();

    if (!comments) {
      return next(new appError("No comments Found", 404));
    }

    res.status(200).json({
      status: "success",
      results: comments.length,
      data: comments,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    return next(new appError(err.message, 404));
  }
};

exports.getComment = (req, res, next) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      res.status(200).json({
        status: "success",
        data: comment,
      });
      if (!Comment) {
        // return res.status(404).json({ message: "no comment found" });
        return next(new appError("No comment Found", 404));
      }
    })
    .catch((err) => {
      // res.status(404).json({
      //   status: "fail",
      //   message: err,
      // });
      return next(new appError(err.message, 404));
    });
};
exports.createComment = async (req, res) => {
  try {
    const newComment = await Comment.create({
      author: req.user._id.toString(),
      post: req.body.post,
      content: req.body.content,
    });
    // console.log(req.user, "userrequest");

    if (!newComment) {
      // return res.status(404).json({ message: "no newComment found" });
      return next(new appError("No newComment Found", 404));
    }
    res.status(201).json({
      status: "success",
      data: newComment,
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
    return next(new appError(err.message, 400));
  }
};
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!comment) {
      // return res.status(404).json({ message: "no comment found" });
      return next(new appError("No comment Found", 404));
    }
    res.status(200).json({
      status: "success",
      data: comment,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    return next(new appError(err.message, 404));
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      // return res.status(404).json({ message: "no comment found" });
      return next(new appError("No comment Found", 404));
    }

    res.status(204).json({
      status: "success",
      data: comment,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    return next(new appError(err.message, 404));
  }
};
