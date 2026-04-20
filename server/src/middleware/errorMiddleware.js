export function notFound(req, res, next) {
  res.status(404);
  const err = new Error(`Not Found — ${req.originalUrl}`);
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(", ") || message;
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
