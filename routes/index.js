const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Post Model
const Post = require('../models/Post');

// Club Model
const Club = require('../models/Club');

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
    email: req.user.email,
    publicaddress: req.user.publicaddress
  })
);

// Policy Address Error
router.get('/policy/addresserror', ensureAuthenticated, (req, res) =>
  res.render('./policy/src/addresserror', {
    publicaddress: req.user.publicaddress
  })
);

// Budget
router.get('/budget', ensureAuthenticated, (req, res) =>
  res.render('./budget/src/budget', {
    type: req.user.type,
    name: req.user.name,
    osis: req.user.osis,
    email: req.user.email,
    publicaddress: req.user.publicaddress
  })
);

// Budget Address Error
router.get('/budget/addresserror', ensureAuthenticated, (req, res) =>
  res.render('./budget/src/addresserror', {
    publicaddress: req.user.publicaddress
  })
);

// Forum
router.get('/forum', ensureAuthenticated, (req, res) => {
  Post.find({}, (err, posts) => {
    res.render('forum', {
      posts: posts,
      type: req.user.type,
      name: req.user.name,
      osis: req.user.osis,
      email: req.user.email,
      publicaddress: req.user.publicaddress
    })
  });
});

// Add Forum Post
router.post('/forum/addpost', (req, res) => {
  var postData = new Post(req.body);
  postData.save()
    .then(result => {
      res.redirect('/forum');
    })
    .catch(err => {
      res.status(400).send("Unable to save data");
    });
});

// Clubs
router.get('/clubs', ensureAuthenticated, (req, res) => {
  Club.find({}, (err, clubs) => {
    res.render('clubs', {
      clubs: clubs,
      type: req.user.type,
      name: req.user.name,
      osis: req.user.osis,
      email: req.user.email
    })
  });
});

// Add Club
router.post('/clubs/addclub', ensureAuthenticated, (req, res) => {
  var postData = new Club(req.body);
  postData.save()
    .then(result => {
      res.redirect('/clubs');
    })
    .catch(err => {
      res.status(400).send("Unable to save data");
    });
});

// Join Club
router.post('/clubs/joinclub', ensureAuthenticated, (req, res) =>
  res.render('joinclub', {
    type: req.user.type,
    name: req.user.name,
    osis: req.user.osis,
    email: req.user.email
  })
);

module.exports = router;