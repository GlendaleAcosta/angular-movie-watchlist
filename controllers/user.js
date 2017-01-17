var pgp = require('pg-promise')();
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var db = require('../database');

exports.postSignUp = function(req,res,next) {

    
    var email = req.body.email;
    var password = req.body.password; 
    
    db.query(
        'SELECT email FROM users WHERE email=${email}', {email})
    .then(function(users){
        
        // If there's a user with the specified email, we can't make an account.
        if (users.length > 0) {
            return res.status(400).json({
                msg: 'That email already exists!'
            })
        }

        // If there are no users with the specified email, we create an account
        var hashedPW = bcrypt.hashSync(password);
        bcrypt.hash(password, null , null, function(err, hashedPW) {
            
            // Password is hashed correctly
            if (!err) {
                db.query(
                    "INSERT INTO users (\
                        role,\
                        email,\
                        password,\
                        date_created)\
                        VALUES (\
                        'user',\
                        $1,\
                        $2,\
                        CURRENT_TIMESTAMP \
                    )", [ email, hashedPW ])
                        
                .then(function(){
                    return res.status(200).json({
                        msg: 'Your account has successfully been created!'
                })
                .catch(function(){
                    return res.status(500).json({
                        msg: 'Your account could not be made. Please try again later.'
                    })
                })
            })

            // Error hashing password
            } else {
                return res.status(500).json({
                    msg: "Something really weird went wrong. Please try again later."
                });
            }
        });
        


    })
    .catch(function(err){
        return res.status(500).json({
            msg: "Something about that email didn't seem okay. Please try again later"
        })
    })
}








exports.postLogin = function(req,res,next) {

    var email = req.body.email;
    var password = req.body.password; 
    
    db.query(
        'SELECT * FROM users WHERE email=${email}', {email})
    .then(function(users){
        var test = 1;
        console.log("test: ", test);

        // if the email exists
        if(users.length > 0) {
            bcrypt.compare(password, users[0].password, function(err, response){

                // Password hashed corretly
                if (!err) {
                    db.query(
                        'UPDATE users \
                        SET last_login = CURRENT_TIMESTAMP \
                        WHERE email=${email}', {email})
                    .then(function(){

                        // Config jwt token without password and deleted date
                        user = users[0];
                        delete user.password;
                        delete user.date_deleted;
                        console.log(user);
                        // Create token
                        var token = jwt.sign(user, "process.env.JWT_SECRET_KEY");

                        return res.status(200).json({
                            msg: 'You have successfully logged in as ' + email,
                            user: user,
                            token: token,
                            isLoggedIn: true
                        })
                    })
                    .catch(function(){
                        return res.status(500).json({
                            msg: 'Something weird happened. Please try again later.'
                        })
                    })
                // error hashing password
                } else {
                    return res.status(300).json({
                        msg: 'Incorrect password or email.'
                    })
                }


            })
        }  
    })
    // if email does not exist
    .catch(function(){
        res.status(400).json({
            msg: 'That email does not exist.'
        })
    })
}



exports.postAuthenticate = function(req, res, next) {

    var token = req.body.token;

    jwt.verify(token, 'process.env.JWT_SECRET_KEY', function(err, decoded) {
        
        return res.status(200).json({
            user: decoded
        }); 
    });
}