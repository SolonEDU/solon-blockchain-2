const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    type: req.user.type,
    name: req.user.name,
    osis: req.user.osis,
    email: req.user.email
  })
);

// Policy
router.get('/policy', ensureAuthenticated, (req, res) =>
  res.render('./policy/src/policy', {
    type: req.user.type,
    name: req.user.name,
    osis: req.user.osis,
    email: req.user.email
  })
);

// Policy History
router.get('/policyhistory', ensureAuthenticated, (req, res) =>
  res.render('./policy/src/policyhistory', {
    type: req.user.type,
    name: req.user.name,
    osis: req.user.osis,
    email: req.user.email
  })
);

// Budget
router.get('/budget', ensureAuthenticated, (req, res) =>
  res.render('budget', {
    type: req.user.type,
    name: req.user.name,
    osis: req.user.osis,
    email: req.user.email
  })
);

module.exports = router;