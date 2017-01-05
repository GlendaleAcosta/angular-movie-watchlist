var pgp = require('pg-promise')();
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// Database Config
var connection = {
    host: 'localhost',
    port: 5433,
    database: 'movie_watchlist',
    user: 'postgres',
    password: 'rootpw'
};
// Database Connection
var db = pgp(connection);

exports.postSignUp = function(req,res,next) {

    
    var email = req.body.email;
    var password = req.body.password; 
    
    db.query(
        'SELECT email FROM users WHERE email=${email}', {email})
    .then(function(users){
        
        // If there's a user with the specified email, we can't make an account.
        if (users.length > 0) {
            return res.json({
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
                        CURRENT_TIMESTAMP\
                    )", [ email, hashedPW ])
                        
                .then(function(){
                    return res.json({
                        msg: 'Your account has successfully been created!'
                })
                .catch(function(){
                    return res.json({
                        msg: 'Your account could not be made. Please try again later.'
                    })
                })
            })

            // Error hashing password
            } else {
                return res.json({
                    msg: "Something really weird went wrong. Please try again later."
                });
            }
        });
        


    })
    .catch(function(err){
        return res.json({
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

        // if the email exists
        if(users.length > 0) {
            bcrypt.compare(email, users[0].password, function(err, response){

                // Password hashed corretly
                if (!err) {
                    db.query(
                        'UPDATE users \
                        SET last_login = CURRENT_TIMESTAMP \
                        WHERE email=${email}', {email})
                    .then(function(){

                        // Config jwt token without password and deleted date
                        user = users[0]
                        delete user.password;
                        delete user.date_deleted;

                        // Create token
                        var token = jwt.sign(email, "process.env.JWT_SECRET_KEY");

                        return res.json({
                            msg: 'You have successfully logged in as ' + email,
                            user: user,
                            token: token,
                            isLoggedIn: true
                        })
                    })
                    .catch(function(){
                        return res.json({
                            msg: 'Something weird happened. Please try again later.'
                        })
                    })
                // error hashing password
                } else {
                    return res.json({
                        msg: 'Something really weird happened. Please try again later.'
                    })
                }


            })
        }  
    })
    // if email does not exist
    .catch(function(){
        res.json({
            msg: 'That email does not exist.'
        })
    })
}



exports.postAuthenticate = function(req, res, next) {

    var token = req.body.token;

    jwt.verify(token, 'process.env.JWT_SECRET_KEY', function(err, decoded) {
        res.json({email: decoded}); 
    });
}