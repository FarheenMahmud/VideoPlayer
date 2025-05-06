module.exports = (req, res, next) => {
    if (!req.session.email) {
      return res.render('login', { error: 'You must login to access this content.' });
    }
    next();
  };
  