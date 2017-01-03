var pgp = require('pg-promise')();
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var connection = {
    host: 'localhost',
    port: 5433,
    database: 'movie_watchlist',
    user: 'postgres',
    password: 'rootpw'
};
var db = pgp(connection);

exports.postSignUp = function(req,res,next) {
    var email = req.body.email;
    var password = req.body.password; 
    
    db.query('SELECT email FROM users WHERE email=${email}', {email})
    
        .then(function(data){
            
            // If the email does not exist, we can create an account
            if (data.length === 0) {

                var hash = bcrypt.hashSync(password);
                bcrypt.hash(password, null , null, function(err, hash) {
                    if (!err) {
                        db.query("INSERT INTO users (role, email, password, date_created) VALUES ( 'user', $1, $2, CURRENT_TIMESTAMP)", [email, hash])
                            .then(function(){
                                res.json({
                                    msg: 'Your account has successfully been created!'
                                })
                        })
                    } else {
                        res.json({
                            msg: "Something really weird went wrong. Try again later."
                        });
                    }
                });

            } else {
                res.json({
                    msg: 'That email already exists!'
                })
            }
        })
        .catch(function(err){
            console.log(err);
        })
}








exports.postLogin = function(req,res,next) {
    var email = req.body.email;
    var password = req.body.password; 
    
    db.query('SELECT * FROM users WHERE email=${email}', {email})
    .then(function(data){
        
        if(data.length > 0) {
            bcrypt.compare(email, data[0].password, function(err, response){

                if (!err) {
                    db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email=${email}', {email})
                    .then(function(){
                        user = data[0]
                        delete user.password;
                        delete user.date_deleted;

                        var token = jwt.sign(email, "process.env.JWT_SECRET_KEY");

                        res.json({
                            msg: 'You have successfully logged in as ' + email,
                            user: user,
                            token: token,
                            isLoggedIn: true
                        })
                    })
                }
            })
        }  
    })
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