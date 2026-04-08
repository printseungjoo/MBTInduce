export function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: "Route not found",
  });
}

export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Error";

  res.status(status).json({
    message,
  });
}


