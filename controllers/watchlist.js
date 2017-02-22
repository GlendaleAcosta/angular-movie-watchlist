var pgp = require('pg-promise')();
var db = require('../database');
var jwt = require('jsonwebtoken');
// THIS IS THE START!


exports.postWatchlist = function(req, res, next){
    
    var movieId = req.body.movieId;
    movieId = parseInt(movieId);
    var token = req.body.token;
    

    jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
        var userId = user.id;
        db.query(
            'SELECT movie_id \
            FROM watchlists \
            WHERE user_id = $1 and movie_id = $2', [userId, movieId]
        )
        // db.query(
        //     // Get the array of watchlist_movies
        //     'SELECT watchlist_movies \
        //     FROM user_movies \
        //     WHERE user_id=${userId}', {userId}
        // )
        .then(function(data){
            
            if (data.length === 0) {
                // The movie is not in the watchlist, so we add insert a movie_id
                db.query(
                    'INSERT INTO watchlists (user_id, movie_id) \
                    VALUES ( $1, $2 )' , [userId, movieId]
                )
                .then(function(data){
                    
                    res.json({
                        hasAddedToWatchlist: true,
                        msg: "You've added a movie to your watchlist!"
                    })
                })
                .catch(function(err){
                    // ERROR inserting value into database
                })
            } else {
                // The movie is already in the user's watchlist
                res.json({
                    hasAddedToWatchlist: false,
                    msg: "That movie is already in your watchlist!"
                })
            }
            // Search the array to see if the selected movie exists in their watchlist
            // var watchlist_arr = data[0].watchlist_movies;

            // if (watchlist_arr === null) {
            // // if it's the user's first watchlist movie ever
            //     db.query(
            //         'UPDATE user_movies \
            //         SET watchlist_movies = ARRAY[$1] \
            //         WHERE user_id = $2 ', [movieId, userId]
            //     )
            //     .then(function(){
            //         return res.json({
            //             hasAddedToWatchlist: true,
            //             msg: "You've added your first movie to your watchlist!"
            //         })
            //     })
            //     .catch(function(err){
            //         console.log(err);
            //     })
            // } else {
            // // if it's at least the user's 2nd watchlist movie ever
            //     var watchlist_length = data[0].watchlist_movies.length;
            //     var hasMovie = false;

            //     for(var i = 0; i < watchlist_length; i++) {

            //         if(watchlist_arr[i] === movieId) {
                        
            //             hasMovie = true;
            //             break;
            //         }
            //     }
                
            //     if (hasMovie === true) {
            //         // The movie exists in their watchlist
            //         return res.json({
            //             hasAddedToWatchlist: false,
            //             msg: "The movie is already in your watchlist!"
            //         })
            //     } else {

            //         var newMovieIndexNum = watchlist_length + 1;
            //         db.query(
            //             'UPDATE user_movies \
            //             SET watchlist_movies[$1] = $2 \
            //             WHERE user_id=$3' , [newMovieIndexNum, movieId ,userId]
            //         )
            //         .then(function(){
            //             res.status(200).json({
            //                 hasAddedToWatchlist: true,
            //                 msg: "You've added another movie to your watchlist!"
            //             })
            //         })
            //         .catch(function(err){
            //             console.log(err);
            //             console.log("idk wut happened but it didn't work.");
            //         })

            //     }


            // }

            
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
            'SELECT movie_id \
            FROM watchlists \
            WHERE user_id = ${userId}', {userId}
        )
        .then(function(data){

            var watchlist = data;
            res.status(200).json({
                watchlist: watchlist
            }) 
        })
        .catch(function(err){
            // Error getting movies from database
        })
        // db.query(
        //     'SELECT watchlist_movies FROM user_movies \
        //     WHERE user_id=${userId}', {userId}
        // )
        // .then(function(data){
        //     var watchlist = data[0].watchlist_movies;
        //     res.status(200).json({
        //         watchlist: watchlist
        //     })
        // })
        // .catch(function(err){

        // })
    })


}

exports.deleteWatchlist = function(req, res, next){
    
    var movieId = req.body.movieId;
    movieId = parseInt(movieId);
    var token = req.body.token;
    // var movieIndex = req.body.movieIndex;

    console.log(req.body);

     jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
         var userId = user.id;
         db.query(
             'SELECT movie_id \
             FROM watchlists \
             WHERE user_id = $1 AND movie_id = $2', [userId, movieId]
         )
        
        //  db.query(
        //      'SELECT watchlist_movies \
        //      FROM user_movies \
        //      WHERE user_id=$1', [userId]
        //  )
         .then(function(data){
             
             if (data.length > 0) {
                 console.log("This movie exists! We just need to delete this.");
                 db.query(
                     'DELETE FROM watchlists \
                     WHERE user_id = $1 and movie_id = $2 ', [userId, movieId]
                 )
                 .then(function(data){
                     res.json({
                         hasDeletedMovie: true,
                         msg: 'This movie has been deleted from your watchlist!'
                     })
                 })
                 .catch(function(err){
                    //  Error deleting movie from database
                 })
             }
            //  var watchlist_movies = data[0].watchlist_movies;
            //  var watchlist_movies_length = watchlist_movies.length;
             
            //  movieIndex = watchlist_movies.indexOf(movieId);
            //  watchlist_movies.splice(movieIndex, 1);
            
            //  db.query(
            //      'UPDATE user_movies \
            //      SET watchlist_movies = $1  \
            //      WHERE user_id= $2', [watchlist_movies, userId]
            //  )
            //  .then(function(data){
                 
            //      return res.json({
            //          msg: 'The movie has been deleted from your watchlist!'
            //      })
            //  })
            //  .catch(function(err){
                 
            //      console.log(err);
            //      console.log("idk man, there was an error");
            //  })

         })
         .catch(function(err){
             console.log(err);
         })
     })

}