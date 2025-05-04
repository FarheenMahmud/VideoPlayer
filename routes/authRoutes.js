// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  });
  

module.exports = router;
