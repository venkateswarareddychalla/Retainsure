function NotFoundError(req, res, next) {
  res.status(404).json({ message: "Endpoint not found" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

module.exports = { NotFoundError, errorHandler };
