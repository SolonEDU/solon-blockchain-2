const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const User = require('../models/User');

// Metamask Setup Page
router.get('/mmsetup', (req, res) => res.render('mmsetup'));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { type, osis, email, publicaddress, password, password2 } = req.body;
    let errors = [];

    if (!type || !osis || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (isNaN(osis)) {
        errors.push({ msg: 'Invalid OSIS' });
    }

    if (osis.length != 9) {
        errors.push({ msg: 'OSIS should be 9 digits' });
    }

    if (publicaddress.length != 42) {
        errors.push({ msg: 'Invalid Public Address' });
    }

    // Check passwords match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check pass length
    if (password.length < 8) {
        errors.push({ msg: 'Password should be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            type,
            osis,
            email,
            publicaddress,
            password,
            password2
        });
    } else {
        // Validation passed
        if (type == 'student') {
            User.findOne({ email: email }).then(sameemail => {
                if (sameemail) {
                    // User with same email exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        type,
                        osis,
                        email,
                        publicaddress,
                        password,
                        password2
                    });
                } else {
                    User.findOne({ osis: osis }).then(sameosis => {
                        if (sameosis) {
                            // User with same email exists
                            errors.push({ msg: 'OSIS is already registered' });
                            res.render('register', {
                                errors,
                                type,
                                osis,
                                email,
                                publicaddress,
                                password,
                                password2
                            });
                        } else {
                            const newUser = new User({
                                type,
                                osis,
                                email,
                                publicaddress,
                                password
                            });

                            // Hash Password
                            bcrypt.genSalt(10, (err, salt) =>
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    // Set password to hashed
                                    newUser.password = hash;
                                    // Save user
                                    newUser
                                        .save()
                                        .then(user => {
                                            req.flash(
                                                'success_msg',
                                                'You are now registered and can log in'
                                            );
                                            res.redirect('/users/login');
                                        })
                                        .catch(err => console.log(err));
                                })
                            );
                        }
                    })
                }
            });
        }
        else if (type == 'parent') {
            User.findOne({ osis: osis }).then(user => {
                if (!user) {
                    // Student with osis does not exist
                    errors.push({ msg: 'No student is registered with that OSIS' });
                    res.render('register', {
                        errors,
                        type,
                        osis,
                        email,
                        publicaddress,
                        password,
                        password2
                    });
                } else {
                    User.countDocuments({ osis: osis }).then(count => {
                        if (count > 1) {
                            // Parent associated with OSIS already exists
                            errors.push({ msg: 'One parent is already registered with that OSIS' });
                            res.render('register', {
                                errors,
                                type,
                                osis,
                                email,
                                publicaddress,
                                password,
                                password2
                            })
                        }
                        else {
                            const newUser = new User({
                                type,
                                osis,
                                email,
                                publicaddress,
                                password
                            });
                            // Hash Password
                            bcrypt.genSalt(10, (err, salt) =>
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    // Set password to hashed
                                    newUser.password = hash;
                                    // Save user
                                    newUser
                                        .save()
                                        .then(user => {
                                            req.flash(
                                                'success_msg',
                                                'You are now registered and can log in'
                                            );
                                            res.redirect('/users/login');
                                        })
                                        .catch(err => console.log(err));
                                })
                            )
                        }
                    })
                }
            });
        }
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;