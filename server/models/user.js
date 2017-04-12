const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
// our user model
// {
//     email: "ruthar@gmail.com",
//     password: "jgoinwrfgnwglasfasn",
//     tokens: [{
//         access:'auth',
//         token:"jvqionearungq3nov"
//     }]
// }

//creating a mongoose schema, since we cannot add on methods on top of User model
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
        unique: true,
        //use mongoose - custom validators to validate email
        validate: {
            // validator: (value) => {
            //     //use npm module validator here to validate the email string
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]

});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}
UserSchema.methods.generateAuthTokens = function() {
    //not using arrow keyword since it does not have access to the this keyword
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123');
    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        //or
        return Promise.reject('auth failed')
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }).then((user) => {
        if (!user) {

        }
        return user;
    })
}
var User = mongoose.model('User', UserSchema);

module.exports = { User };