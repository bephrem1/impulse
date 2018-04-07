// express dependency
const express = require('express');

// General dependencies
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const credentials = require('./credentials');
const index = require('./routes/index.js'); // Route File

// Set up default mongoose connection
mongoose.connect(credentials.MONGODB_CONNECTION_URI);

// Get the default connection
let db = mongoose.connection;

//Listen for db error events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Listen for db open
db.on('open', function() {
    console.log("\nSuccessfully connected to database.");
});

// Call express module and store app const
const app = express();

// View engine Setup
app.set('views', path.join(__dirname, 'views')); //set pointer to views
app.set('view engine', 'ejs');

//Initialization Middleware
app.use(logger('dev')); /* for colorful console logging of requests */
app.use(bodyParser.json()); //Setup body Parser
app.use(bodyParser.urlencoded({ extended: false })); //Setup body Parser

// Configure session (track logins)
// Sessions can be used for people logged in or not
app.use(session({
    secret: credentials.SESSION_ID_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Resave forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // saveUninitialized forces a session that is "uninitialized" to be saved to the store.
    store: new MongoStore({
        mongooseConnection: db //Now our database holds session data in Mongo and not in server RAM
    })
}));

// Make user id avaliable to templates.
app.use(function(req, res, next) {
    res.locals.currentUser = req.session.userId; //This tacks on currentUser into the info passed to views
    next();
});

app.use(express.static(path.join(__dirname, 'public'))); // setup pointer to static assets

app.use('/', index); // attach index routes with base uri '/'

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    console.log(err);

    res.render('error');
});

module.exports = app; //Export module for use in bin/www
