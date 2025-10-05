function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  if (status >= 500) console.error(err);
  res.status(status).json({ message });
}
module.exports = { errorHandler }; // đây export là object có field errorHandler
