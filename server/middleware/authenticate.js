var { User } = require('../models/user');
var authenticate = (req, res, next) => {
    console.log('auth req recieved')
    var token = req.header('x-auth');
    console.log(token);
    User.findByToken(token).then((user) => {
        if (!user) {
            //res.status(401).send();
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = { authenticate };