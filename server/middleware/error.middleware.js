class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleWare = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  console.log(err);

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "jsonwebTokenError") {
    const message = `JSON web Toekn is Invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `JSON web Toekn is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  if(err.code === 11000){
    const message = `Dupliacte ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message,400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
};


export default ErrorHandler;