const express = require("express");
const app = express();
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const authController = require("./controllers/authController");
const appError = require("./middlewares/errorHandling");
app.use(express.json());

app.use("/blog/posts", postRouter);
app.use("/blog/comments", commentRouter);
app.post("/signup", authController.signup);
app.post("/login", authController.login);

// app.all("*", (req, res) => {
//   return next(new appError(`can't find ${req.originalUrl} in the server`, 404));
// });

module.exports = app;
