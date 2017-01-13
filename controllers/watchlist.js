var pgp = require('pg-promise')();
var db = require('../database');
var jwt = require('jsonwebtoken');

exports.postWatchlist = function(req, res, next){
    
    var movieId = req.body.movieId;
    movieId = parseInt(movieId);
    var token = req.body.token;
    

    jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
        var userId = user.id
  
        db.query(
            // Get the array of watchlist_movies
            'SELECT watchlist_movies \
            FROM user_movies \
            WHERE user_id=${userId}', {userId}
        )
        .then(function(data){
            
            // Search the array to see if the selected movie exists in their watchlist
            var watchlist_arr = data[0].watchlist_movies;
            var watchlist_length = data[0].watchlist_movies.length;
            var hasMovie = false;

            for(var i = 0; i < watchlist_length; i++) {

                if(watchlist_arr[i] === movieId) {
                    
                    hasMovie = true;
                    break;
                }
            }
            
            if (hasMovie === true) {
                // The movie exists in their watchlist
                return res.json({
                    msg: "The movie is already in your watchlist!"
                })
            } else {

                var newMovieIndexNum = watchlist_length + 1;
                db.query(
                    'UPDATE user_movies \
                    SET watchlist_movies[$1] = $2 \
                    WHERE user_id=$3' , [newMovieIndexNum, movieId ,userId]
                )
                .then(function(){
                    res.status(200).json({
                        msg: "You've added another movie to your watchlist!"
                    })
                })
                .catch(function(err){
                    console.log(err);
                    console.log("idk wut happened but it didn't work.");
                })

           }
            
        })
        .catch(function(err){
            console.log(err);
        })
    });
    
    
}



exports.getWatchlist = function(req, res, next){
    var authHeader = req.headers.authorization;
    var token = authHeader.slice(7);
    
    jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
        console.log(user);
        var userId = user.id;
        db.query(
            'SELECT watchlist_movies FROM user_movies \
            WHERE user_id=${userId}', {userId}
        )
        .then(function(data){
            var watchlist = data[0].watchlist_movies;
            res.status(200).json({
                watchlist: watchlist
            })
        })
        .catch(function(err){

        })
    })


}