const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Auth = require('../models/auth');
const dateHelpers = require('../helpers/dateHelpers');
const http = require('http');
const mongoose = require('mongoose');

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

                let cartSize = 0;

                var monthBoundaries = [
                    new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()
                ];

                // Frequency counters
                var impulseMonthCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var purchaseMonthCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                let today = new Date();
                let curMonth = today.getMonth();
                
                // Adds date boundaries separated by months
                for (i = 0; i < 12; i++){
                    if (curMonth-i < 0){
                        monthBoundaries[i].setMonth(12+curMonth-i);
                        monthBoundaries[i].setFullYear(today.getFullYear()-1);
                    } else {
                        monthBoundaries[i].setMonth(curMonth-i);
                    }
                    monthBoundaries[i].setDate(1);
                }

                let label = [0,1,2,3,4,5,6,7,8,9,10,11];
                
                // Iterates through purchasedata
                if (user){
                    cartSize = user.purchaseData.length;
                    user.purchaseData.forEach(element => {
                        if (element.wasPurchased == false){
                            impulseSum ++;
                            impulseDollars += element.itemPrice;
                        }

                        let purchaseD = new Date(element.purchaseDate * 1000);
                        for (i = 0; i < 11; i++){
                            // If the current purchasedata lies within the time range
                            if (purchaseD >= monthBoundaries[i]){
                                // Adds to the relevant counter array
                                if (!element.wasPurchased){
                                    impulseMonthCounter[i]++;
                                } else {
                                    purchaseMonthCounter[i]++;
                                }
                                break;
                            }
                        }

                    });
                }


                for (i = 0; i < 12; i++){
                    monthBoundaries[i] = monthBoundaries[i].getMonth()+1;
                }
                
                // If no error render dashboard and pass user object in model
                
                monthBoundaries = monthBoundaries.reverse();
                purchaseMonthCounter = purchaseMonthCounter.reverse();
                impulseMonthCounter = impulseMonthCounter.reverse();

                // impulseSum = impulseMonthCounter[0];
                return res.render('dashboard', {
                    user, impulseDollars, impulseSum, cartSize, purchaseMonthCounter, impulseMonthCounter, monthBoundaries, label
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

// POST '/sign-in-extension'
router.post('/sign-in-extension', function(req, res, next) {
    if(req.body.email && req.body.password && req.body.ip){

        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error || !user){
                return res.json({
                    error: "error"
                });
            } else {
                // User found
                // Hacky Solution: Save the id to the auth database and pull from separated components
                let auth = new Auth({ip: req.body.ip, id: user._id});
                auth.save(function (err, auth) {
                    // Done. Respond with the user data.
                    return res.json({
                        user
                    });
                });
            }
        });
    }
});

// GET '/auth/:ip'
router.get('/auth/:ip', function(req, res, next) {
    const clientIp = req.params.ip;
    console.log(clientIp);
    Auth.findOne({ip: clientIp }, function (err, authDocument) {
        if(err || authDocument === null){
            return res.json({
                userId: ""
            });
        }
        // Return the user id for the auth'ed ip
        return res.json({
            userId: authDocument.id
        });
    });
});

// DELETE '/auth/:ip'
router.delete('/auth/:ip', function(req, res, next) {
    const clientIp = req.params.ip;
    Auth.remove({ip: clientIp}).exec()
        .then(result => {
            res.json({
                status: "success"
            })
        })
        .catch(err => {
            res.json({
                status: "failure"
            })
        });
});

/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/

module.exports = router;
