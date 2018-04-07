const express = require('express');
const router = express.Router();

const User = require('../models/user');
const dateHelpers = require('../helpers/dateHelpers');

const mid = require('../middleware/index');

// GET '/'
router.get('/', function(req, res, next) {
    return res.render('index');
});

// GET '/dashboard'
router.get('/dashboard', mid.requiresLogin, function(req, res, next) {

    // Pull the purchases off of the user document
    User.findById(req.session.userId)
        .exec(function (error, user) { //Execute the search
            if (error) {
                return res.redirect('/');
            } else {
                let impulseSum = 0;
                let impulseDollars = 0;

                user.purchaseData.forEach(element => {
                    if (element.wasPurchased == false){
                        impulseSum++;
                        impulseDollars += element.itemPrice;
                    }
                    
                    
                });

                // If no error render dashboard and pass user object in model
                return res.render('dashboard', {
                    user, impulseDollars, impulseSum
                });
            }
        });

});

// GET '/sign-in'
router.get('/sign-in', mid.checkAlreadyLoggedIn, function(req, res, next) {
    return res.render('sign-in');
});

// GET '/sign-up'
router.get('/sign-up', mid.checkAlreadyLoggedIn, function(req, res, next) {
    return res.render('sign-up');
});


/*************************************************************************************/
/******************************** User Auth Endpoints ********************************/
/*************************************************************************************/

// GET /log-out
router.get('/log-out', function(req, res, next) {
    if(req.session){
        //If session exists destroy the session and redirect to the homepage
        req.session.destroy(function(err){
            if(err){
                //Error destroying session
                next(err);
            } else {
                //Session destroyed, user logged out. Redirect to homepage.
                return res.redirect('/');
            }
        });
    }
});

// POST '/sign-up'
router.post('/sign-up', function(req, res, next) {
    //Server-side form error checking code
    if(req.body.name && req.body.email && req.body.password){
        // Extract form info into object
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        //Use schema's built in 'create' method to insert this entry into mongo
        User.create(userData, function(error, user){
            if(error){
                //There was an error creating the user account
                return res.redirect('/sign-up');
            } else {
                //Success, create a session with the newly created user's id and redirect to profile route
                req.session.userId = user._id;

                //Redirect to profile uri which renders profile page
                return res.redirect('/dashboard');
            }
        });

    } else{
        //Incomplete input
        return res.redirect('/sign-up');
    }
});

// POST '/sign-in'
router.post('/sign-in', function(req, res, next) {
    if(req.body.email && req.body.password){

        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error || !user){
                return res.redirect('/sign-in');
            } else {
                // User found

                // create session cookie with userId
                req.session.userId = user._id;

                //Redirect to the profile page where user info will be loaded from db
                return res.redirect("/dashboard");
            }
        });
    } else {
        //Incomplete input
        return res.redirect('/sign-in');
    }
});

/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/

module.exports = router;
