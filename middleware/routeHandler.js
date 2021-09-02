const routeHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Route not found on server, please check",
    errorMessage: err.message,
  });
};

module.exports = routeHandler;
