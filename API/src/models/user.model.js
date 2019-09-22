import { Schema, model } from 'mongoose';
const sha256 = require('js-sha256');
const moment = require('moment');

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    role: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    salt: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
});  

userSchema.statics.validateNewUser = async function (toCheck) {
    let user = await this.find({ username: toCheck.username });
    let user2 = await this.find({ email: toCheck.email });
    let errors = [];
    if(user.length !== 0) {
        errors.push({
            "value": toCheck.username,
            "msg": "Username already in use!",
            "param": "username"
        });
    }
    if(user2.length !== 0) {
        errors.push({
            "value": toCheck.email,
            "msg": "E-mail address already in use!",
            "param": "email"
        });
    }
    return errors;
};

userSchema.statics.prepareSecretInfo = function(toPrepare) {
    toPrepare.salt = sha256(moment.now().toString());
    toPrepare.password = sha256(toPrepare.password + toPrepare.salt);
    return toPrepare;
}

userSchema.statics.validateLogin = async function(toCheck) {
    let user = await this.findOne({ email: toCheck.email });
    if(!user)
        return false;
    let saltedPassword = sha256(toCheck.password + user.salt);
    return user.password === saltedPassword;
}

userSchema.statics.getUserByEmail = async function(u) {
    let user = await this.findOne({ email: u });
    return user;
}

export default model('User', userSchema);
