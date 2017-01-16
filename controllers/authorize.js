var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    if(req.body.token) {
        var token = req.body.token;
        jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
            req.body.CRAP = user;
        })
        
    } 
    next();
}