import pkg from "express";
const { request, response } = pkg;

const notFound = (req: typeof request, res: typeof response, next: any) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: Error,
  req: typeof request,
  res: typeof response,
  next: any
) => {
  let StatusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId error
  if (err.name === "CastError" && err.cause === "ObjectId") {
    message = "Resource not found";
    StatusCode = 404;
  }

  res.status(StatusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
