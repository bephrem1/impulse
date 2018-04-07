function checkAlreadyLoggedIn(req, res, next){
    if(req.session && req.session.userId){
        //This means the user is logged in
        //Take them to their profile page
        return res.redirect('/dashboard');
    }

    return next();
}

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        //User is logged in. They may enter.
        return next();
    } else {
        //User is not logged in. User must log in.
        return res.redirect('/sign-in');
    }
}

module.exports.checkAlreadyLoggedIn = checkAlreadyLoggedIn;
module.exports.requiresLogin = requiresLogin;
