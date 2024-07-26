const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appError = require("../middlewares/errorHandling");
const Users = require("../model/blogModel");
require("dotenv").config();

const app = express();
app.use(express.json());

exports.signup = async (req, res, next) => {
  try {
    // if (!username || !email || !password) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }
    const newUser = await Users.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });
    // console.log(newUser);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    // res.status(500).json({
    //   status: "error",
    //   message: err.message,
    // });
    // next(new appError(error.message, 500));
    next(error);
    console.log(error);
  }
};

exports.verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
      const jwtdecrypt = await jwt.verify(
        bearerToken,
        process.env.JWT_SECRET_KEY
      );
      // console.log(jwtdecrypt, "decrypt data");
      req.user = await Users.User.findById(jwtdecrypt.id);
      // console.log(req.user, "user-data");
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new appError("Token has been Expired", 403));
      } else {
        return next(new appError("Invalid Token", 403));
      }
    }
  } else {
    // res.status(403).json({
    //   status: "error",
    //   message: "You are not authorized to access this resource",
    // });
    next(new appError("you are not authorized to perform this action", 403));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.isAuthorized = (resource) => {
  return async (req, res, next) => {
    try {
      let doc;
      const { id } = req.params;

      if (resource === "post") {
        doc = await Users.Post.findById(id);
      } else if (resource === "comment") {
        doc = await Users.Comment.findById(id);
      }

      if (!doc) {
        return res.status(404).json({ error: "Resource not found" });
      }

      if (doc.author.toString() !== req.user.id && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "You do not have permission to perform this action" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// console.log(process.env.JWT_SECRET_KEY);

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      // return res.status(401).json({
      //   status: "fail",
      //   message: "Please provide email and password",
      // });
      return next(new appError("Please provide email and password", 401));
    }
    const user = await Users.User.findOne({ email }).select("+password");
    // console.log(user);
    // console.log(await bcrypt.compare(password, user.password));
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // return res.status(401).json({
      //   status: "fail",
      //   message: "Invalid email or password",
      // });
      return next(new appError("Invalid email or password", 401));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    // Users.User.findOne;
    res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    // res.status(500).json({
    //   status: "error",
    //   message: err.message,
    // });
    next(new appError(err.message, 500));
  }
};
