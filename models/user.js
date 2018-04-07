//*************** Generic User Document ***************//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true, // Mongodb will enforce the presence of this field
        trim: true // Removes white space that may be before or after entry
    },
    password: {
        type: String,
        required: true
    },
    //*************** Purchase Data ***************// // TODO: Move purchase data into its own document.
    purchaseData: [
        {
            // The title of the item that was purchased or not
            itemTitle: {
                type: String
            },
            // The price of the item that was purchased or not
            itemPrice: {
                type: Number
            },
            // Epoch of when this purchase took place
            purchaseDate: {
                type: Number
            },
            // Boolean whether the item was purchased or not
            wasPurchased:{
                type: Boolean
            },
            // Reason item was purchased or not purchased
            decisionReason:{
                type: String
            }
        }
    ]
});

// Authenticate input against database documents. Static method off of schema.
UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({ email : email})
        .exec(function(error, user){
            if(error){
                //There was an error during the search
                return callback(error);
            } else if (!user){
                //User was not found
                const err = new Error('User not found!');
                err.status = 401;
                return callback(err);
            }
            //If code comes to this point then a user was found in the database
            //Compare the password to the found user
            bcrypt.compare(password, user.password, function(error, result){
                if(result === true){
                    //Passwords match
                    return callback(null, user); //Return null (for the error value) and retrun the user document to the callback since we know it matches
                } else {
                    //Passwords don't match
                    const err = new Error("Passwords don't match");
                    err.status = 401;
                    return callback(err);
                }
            });

        });
};

// Presave hook
UserSchema.pre('save', function(next) {
    const user = this;

    //Hash the password
    bcrypt.hash(user.password, 13, function(err, hash) {
        //Handle any errors and pass it to the error handler
        if(err){
            next(err);
        }
        //Store the hash into the user password field before document is persisted to the database
        user.password = hash;

        //The middleware is finished, pass execution to the next function
        next();
    });

});

const User = mongoose.model('User', UserSchema); //Create model named 'User' using UserSchema
module.exports = User; //Export the User object now with a schema defined above
