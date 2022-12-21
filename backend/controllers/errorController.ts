import AppError from "../utils/appError";

const handleJWTError = () =>
  new AppError("Invalid Token. Please Login again", 401);
const handleJWTExpiredError = () =>
  new AppError("Your Token expired. Please Login again", 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      // stack: err.stack,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      // (A) Operational, trusted error: send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // (B) Programming or other unknown error: don't leak error details
    // (1) Log error
    // console.error("ERROR", err);

    // (2) Send generic message
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }

  if (err.isOperational) {
    // (A) Operational, trusted error: send message to client
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      message: err.message,
    });
  }
  // (B) Programming or other unknown error: don't leak error details
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    message: "Please Try again later.",
  });
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
export default errorController;
