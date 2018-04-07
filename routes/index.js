const express = require('express');
const router = express.Router();

// GET '/'
router.get('/', function(req, res, next) {
    return res.render('index');
});

router.get('/dashboard', function(req, res, next) {
    return res.render('dashboard');
});

router.get('/sign-in', function(req, res, next) {
    return res.render('sign-in');
});

router.get('/sign-up', function(req, res, next) {
    return res.render('sign-up');
});


module.exports = router;
