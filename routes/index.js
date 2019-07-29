const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    type: req.user.type,
    osis: req.user.osis
  })
);

// Policy
router.get('/policy', ensureAuthenticated, (req, res) =>
  res.render('policy', {
    type: req.user.type,
    osis: req.user.osis
  })
);

// Budget
router.get('/budget', ensureAuthenticated, (req, res) =>
  res.render('budget', {
    type: req.user.type,
    osis: req.user.osis
  })
);

module.exports = router;