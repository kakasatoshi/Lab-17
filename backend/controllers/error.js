exports.get404 = (req, res, next) => {
  res.status(404).json({
    message: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn || false
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).json({
    message: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn || false
  });
};
