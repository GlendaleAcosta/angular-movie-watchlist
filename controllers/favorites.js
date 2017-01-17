var pgp = require('pg-promise')();
var db = require('../database');
var jwt = require('jsonwebtoken');



exports.getFavoriteMovies = function(req, res, next){
    var authHeader = req.headers.authorization;
    var token = authHeader.slice(7);
    
    jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
        
        var userId = user.id;
        db.query(
            'SELECT movie_id \
            FROM favorite_movies \
            WHERE user_id = $1', [userId]
        )
        // db.query(
        //     'SELECT favorite_movies FROM user_movies \
        //     WHERE user_id=${userId}', {userId}
        // )
        .then(function(data){
            console.log(data);
            var favoriteMovies = data;
            // var favoriteMovies = data[0].favorite_movies;
            return res.status(200).json({
                favoriteMovies: favoriteMovies
            })
        })
        .catch(function(err){

        })
    })


}



exports.postFavoriteMovies = function(req,res, next) {
    
    var movieId = req.body.movieId;

    movieId = parseInt(movieId);
    var token = req.body.token;

    jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
        var userId = user.id;
        db.query(
            'SELECT movie_id \
            FROM favorite_movies \
            WHERE user_id = $1 and movie_id = $2', [userId, movieId]
        )
        // db.query(
        //     // Get the array of watchlist_movies
        //     'SELECT favorite_movies \
        //     FROM user_movies \
        //     WHERE user_id=${userId}', {userId}
        // )
        .then(function(data){
            
            console.log(data);
            if(data.length === 0) {
                console.log("this movies doesn't exist, we just need to add it now");
                db.query(
                    'INSERT INTO favorite_movies (user_id, movie_id) \
                    VALUES ( $1, $2 )', [userId, movieId]
                )
                .then(function(data){
                    return res.json({
                        msg: "You've added a movie to your favorite movies list!"
                    })
                })
                .catch(function(err){
                    // Error adding movie to database
                })
            } else{
                console.log("this movies is already in your favorites list");
                return res.json({
                    msg: "This movie is already in your favorite movies list!"
                })
            }
            // var favorite_movies_arr = data[0].favorite_movies;
            
            // if (favorite_movies_arr === null) {
            // // if it's the user's first favorite movie
            //     db.query(
            //         'UPDATE user_movies \
            //         SET favorite_movies = ARRAY[$1] \
            //         WHERE user_id = $2 ', [movieId, userId]
            //     )
            //     .then(function(){
            //         return res.json({
            //             hasAddedToFavorites: true,
            //             msg: "You've added your first movie to your list of favorite movies!"
            //         })
            //     })
            //     .catch(function(err){
            //         console.log(err);
            //     })
            // } else {
            // // if the user is adding another favorite movie
            //     var favorite_movies_length = favorite_movies_arr.length;
            //     var hasMovie = false;

            //     // Check through list of movies to see if the selected movie exists
            //     for(var i = 0; i < favorite_movies_length; i++) {

            //         if(favorite_movies_arr[i] === movieId) {
                        
            //             hasMovie = true;
            //             break;
            //         }
            //     }

            //     if (hasMovie === true) {
            //         // The movie exists in their list of favorite movies
            //         return res.json({
            //             hasAddedtoFavorites: false,
            //             msg: "The movie is already in your favorite movies list!"
            //         })
            //     } else {
            //         var newMovieIndexNum = favorite_movies_length + 1;

            //         db.query(
            //             'UPDATE user_movies \
            //             SET favorite_movies[$1] = $2 \
            //             WHERE user_id=$3' , [newMovieIndexNum, movieId ,userId]
            //         )
            //         .then(function(){
            //             return res.status(200).json({
            //                 hasAddedtoFavorites: true,
            //                 msg: "You've added another movie to your list of favorite movies!"
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
    })

}





exports.deleteFavoriteMovies = function(req, res, next){
    
    var movieId = req.body.movieId;
    movieId = parseInt(movieId);
    var token = req.body.token;
    // var movieIndex = req.body.movieIndex;

     jwt.verify(token, "process.env.JWT_SECRET_KEY" , function(err, user) {
         
         var userId = user.id || null;

         db.query(
             'SELECT movie_id \
             FROM favorite_movies \
             WHERE user_id = $1 AND movie_id = $2', [userId, movieId]
         )
         .then(function(data){
             
             if (data.length > 0) {
                 
                 db.query(
                     'DELETE FROM favorite_movies \
                     WHERE user_id = $1 and movie_id = $2 ', [userId, movieId]
                 )
                 .then(function(data){
                     res.json({
                         msg: 'This movie has been deleted from your favorite movies list!'
                     })
                 })
                 .catch(function(err){
                    //  Error deleting movie from database
                 })
             }
         })
         .catch(function(err){
             console.log(err);
         })
     })

}