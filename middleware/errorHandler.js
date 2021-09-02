const errorHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "error occurred, see the errMessage key for more details",
  });
};
module.exports = errorHandler;
