const { Post } = require("../model/blogModel");
const appError = require("../middlewares/errorHandling");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    if (!posts) {
      // return res.status(404).json({ message: "No posts found" });
      throw new appError("No posts found", 404);
    }

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    throw new appError(err.message, 404);
  }
};

exports.getPost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      res.status(200).json({
        status: "success",
        data: post,
      });
      if (!post) {
        // return res.status(404).json({ message: "No post found" });
        throw new appError("No post found", 404);
      }
    })

    .catch((err) => {
      // res.status(404).json({
      //   status: "fail",
      //   message: err,
      // });
      throw new appError(err.message, 404);
    });
};
exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id.toString(),
    });
    // console.log("user data logined", req.user._id.toString());

    if (!newPost) {
      // return res.status(404).json({ message: "no post found" });
      throw new appError("no post found", 404);
    }

    res.status(201).json({
      status: "success",
      data: newPost,
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
    throw new appError(err.message, 400);
  }
};
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return next(new appError("No post Found", 404));
    }

    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    throw new appError(err.message, 404);
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "no post found" });
      // throw new appError("no post found", 404);
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    throw new appError(err.message, 404);
  }
};
