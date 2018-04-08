//*************** Hacky Auth Solution ***************//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    ip: {
        type: String
    },
    id: {
        type: String
    }
});


const Auth = mongoose.model('Auth', AuthSchema);
module.exports = Auth;
