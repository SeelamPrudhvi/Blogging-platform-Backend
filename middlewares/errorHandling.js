class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = this.statusCode.toString().startsWith(4) ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = appError;

// exports.errorHandler = (err, req, res, next) => {
//   err.status = err.status || "error";
//   err.statusCode = err.statusCode || 500;

//   switch (err.name) {
//     case "ValidationError":
//       return res.status(400).json({ message: "Validation Error" });
//     case "CastError":
//       return res.status(400).json({ message: "CastError" });
//     case "MongoError":
//       return res.status(400).json({ message: "MongoError" });
//     case "UnauthorizedError":
//       return res.status(401).json({ message: "UnauthorizedError" });
//     case "JsonWebTokenError":
//       return res.status(401).json({ message: "jsonWebTokenError" });

//     default:
//       return res.status(err.statusCode).json({ message: err.message });
//   }
// };
