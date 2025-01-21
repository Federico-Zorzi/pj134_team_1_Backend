function errorHandler(err, req, res, next) {
  res
    .status(err.status ?? 500)
    .json({ error: err.error, message: err.message });
}

module.exports = errorHandler;
