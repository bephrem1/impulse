const express = require('express');
const router = express.Router();

// GET '/'
router.get('/', function(req, res, next) {
    return res.render('index');
});

router.get('/dashboard', function(req, res, next) {
    return res.render('dashboard');
});

router.get('/options', function(req, res, next) {
    return res.render('options');
});

router.get('/login', function(req, res, next) {
    return res.render('sign-in');
});

router.get('/signup', function(req, res, next) {
    return res.render('sign-up');
});


module.exports = router;
