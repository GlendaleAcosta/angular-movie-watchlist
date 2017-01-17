angular.module('myApp.profile', ['ui.router', 'ngAnimate'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('profile', {
            url: '/profile/:userId/:profilePage',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController',
                    resolve: {
                        authenticate: function($http, auth, navData, $timeout, $stateParams, $state){
                            var token = auth.getToken();
                            if (token !== undefined) {
                                auth.authenticate(token, function(){
                                    var user = navData.getUser();
                                    
                                    $stateParams.userId = parseInt($stateParams.userId);
                                    if(user.id !== $stateParams.userId){
                                        $state.go('home');
                                    }
                                });
                           
                            } else {
                                $state.go('home');
                            } 
                        }
                    }
                },
                'page': {
                    templateUrl: 'profile/profile.html',
                    controller: 'profileController',
                    resolve: {
                        validateProfilePage: function($stateParams, $state, navData){
                            var profilePages = [
                                'movie-watchlist',
                                'favorite-movies']
                            var profilePages_length = profilePages.length;
                            var isValidPage = false;
                            
                            for(var i = 0; i < profilePages_length; i++) {
                               if ($stateParams.profilePage === profilePages[i]) {
                                
                                   isValidPage = true;
                                   break;
                               } 
                            }
                            
                            
                            console.log(navData.getUser());

                            if (isValidPage === false) {
                                $state.go('home');
                            }
                            
                        }
                    }
                },
                'footer': {
                    templateUrl: 'footer/footer.html',
                    controller: 'footerController'
                }
            }
        })
}])

.controller('profileController', ['$scope', '$http' , '$stateParams', '$state', '$timeout' , 'auth', 'navData', '$window' , function($scope, $http ,$stateParams, $state, $timeout ,auth, navData, $window){

    $scope.userId = $stateParams.userId;
    var api_key = '1cc7edd7a3b1549a1de32ac8a417a5e4';
    

    var getWatchlist = function(){

        $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            },
            url: '/watchlist'
        })
        .then(function(res){
            var watchlist_arr = res.data.watchlist;
            var watchlist_length = watchlist_arr.length;
            
            for(var i = 0; i < watchlist_length; i++) {

                
                $scope.movies = [];

                $http({
                    method: 'GET',
                    url: 'https://api.themoviedb.org/3/movie/' + watchlist_arr[i].movie_id + '?api_key=' + api_key + '&language=en-US'
                })
                .then(function(res){
                    $scope.movies.push(res.data);
                })
                .catch(function(err){
                    console.log(err);
                })
            }
        

        })
        .catch(function(err){
            console.log(err);
        })
    }

    var getFavoriteMovies = function(){
        
        $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            },
            url: '/favorites'
        })
        .then(function(res){
            console.log("GET FAVORITE MOVIES RESPONSE DATA: ");
            console.log(res.data);

            var favoriteMovies = res.data.favoriteMovies;
            var favoriteMovies_length = favoriteMovies.length;
            
            for(var i = 0; i < favoriteMovies_length; i++) {

                
                $scope.movies = [];

                $http({
                    method: 'GET',
                    url: 'https://api.themoviedb.org/3/movie/' + favoriteMovies[i].movie_id + '?api_key=' + api_key + '&language=en-US'
                })
                .then(function(res){
                    
                    $scope.movies.push(res.data);
                })
                .catch(function(err){
                    console.log(err);
                })

                
            }


        })
        .catch(function(err){
            console.log(err);
        })
    }

    
    $scope.modalWidth = $window.screen.width * 0.3;
    $scope.hoverMovie = function(movie, $index) {
        
        $scope.movieIndex = $index;
        $scope.modalMovie = movie;

        $timeout(function(){
            
            $scope.isOverMovie = true;
            var x = $scope.coordinates.x;
            var y = $scope.coordinates.y;
            var weiner = $window.screen.width - x;
            
            if(weiner < $scope.modalWidth) {
                

                $scope.movieModal = {
                    "display" : "block",
                    "position" : "absolute",
                    "right" : weiner + "px",
                    "top" : y + "px",
                    "z-index" : 20
                }
             
            } else {
                $scope.movieModal = {
                    "display" : "block",
                    "position" : "absolute",
                    "left" : (x + 10) + "px",
                    "top" : (y + 10) + "px",
                    "z-index" : 20
                }
            }
            
        
            

        }, 300);
        
        
    }

    $scope.setModalCoord = function(){
        
        console.log(event);
        // console.log($window.screen.width);
        // console.log(document.getElementsByClassName('movie-modal'));
        // console.log(document.getElementsByClassName('movie-modal')[0].clientWidth);
        // console.log(document.getElementsByClassName('movie-modal')[0].clientHeight);
        // $scope.modalWidth = document.getElementsByClassName('movie-modal')[0].clientWidth;
        // console.log("x : " + $scope.coordinates.x);
        // console.log("y : " + $scope.coordinates.y);
        $scope.coordinates = {
                x: event.pageX,
                y: event.pageY
            }
    
    }

    $scope.leaveMovie = function(){ $scope.isOverMovie = false; }
    $scope.leaveModal = function(){ $scope.isOverMovieModal = false; }
    $scope.overMovieModal = function(){ $scope.isOverMovieModal = true; }

    $scope.showMovieModal = function(){
        
        if ($scope.isOverMovie === true || $scope.isOverMovieModal === true) {
            return true;
        } else {
            return false;
        }
    }

    $scope.addToFavorites = function(){
        var movieId = $scope.modalMovie.id;
        $scope.btmModalMsg = null;
        $http({
            method: 'POST',
            data: {
                movieId: movieId,
                token: auth.getToken()
            },
            url: '/favorites'
        })
        .then(function(res){
            console.log(res.data);
            $scope.btmModalSuccess = res.data.hasAddedFavMovie;
            if($scope.btmModalSuccess === true) {
                $scope.alertStatus = 'alert-success';
                $scope.modalSuccess = "Movie Added!"
            } else {
                $scope.alertStatus = 'alert-danger';
                $scope.modalSuccess = "Failed to add!"
            }
            $scope.btmModalMsg = res.data.msg;
        })
        .catch(function(err){
            console.log(err);
        })
    }

    $scope.addToWatchlist = function(){
            
            var movieId = $scope.modalMovie.id;
            $scope.btmModalMsg = null;
            $http({
                method: 'POST',
                data: {
                    movieId : movieId,
                    token: auth.getToken()
                },
                url: '/watchlist'
            })
                .then(function(res){
                    console.log(res.data);

                    $scope.btmModalSuccess = res.data.hasAddedToWatchlist;
                    if($scope.btmModalSuccess === true) {
                        $scope.alertStatus = 'alert-success';
                        $scope.modalSuccess = "Movie Added!"
                    } else {
                        $scope.alertStatus = 'alert-danger';
                        $scope.modalSuccess = "Failed to add!"
                    }
                    $scope.btmModalMsg = res.data.msg;
                })
                .catch(function(err){

                })
        }

    $scope.addToWatched = function(){
        alert("Doesn't work yet");
    }

    $scope.deleteFromWatchlist = function(){
        $scope.btmModalMsg = null;
        var movieId = $scope.modalMovie.id;
        var movieIndex = $scope.movieIndex; 

        $http({
            method: "DELETE",
            data: {
                movieId: movieId,
                movieIndex : movieIndex,
                token: auth.getToken()
            },
            url: "/watchlist"
        })
        .then(function(res){
            console.log("delete from watchlist response:");
            console.log(res.data);
            $scope.btmModalSuccess = res.data.hasDeletedMovie;
            if($scope.btmModalSuccess === true) {
                $scope.alertStatus = 'alert-success';
                $scope.modalSuccess = "Movie deleted!"
            } else {
                $scope.alertStatus = 'alert-danger';
                $scope.modalSuccess = "Failed:"
            }
            $scope.btmModalMsg = res.data.msg;

        
            // $state.reload()
        })
        .then(function(){
            getWatchlist();

        })
        .catch(function(err){

        })
    }
    $scope.deleteFromFavorites = function(){
        var movieId = $scope.modalMovie.id;
        var movieIndex = $scope.movieIndex; 
        $scope.btmModalMsg = null;
        $http({
            method: "DELETE",
            data: {
                movieId : movieId,
                movieIndex : movieIndex,
                token: auth.getToken()
            },
            url: "/favorites"
        })
        .then(function(res){
            console.log(res.data);
            $scope.btmModalSuccess = res.data.hasDeletedFavMovie;
            if($scope.btmModalSuccess === true) {
                $scope.alertStatus = 'alert-success';
                $scope.modalSuccess = "Movie deleted!"
            } else {
                $scope.alertStatus = 'alert-danger';
            }
            $scope.btmModalMsg = res.data.msg;
        })
        .catch(function(err){
            
        })
    }
    

    $scope.removeBtmModal = function(){
        $scope.btmModalMsg = null;
    }


    if ($stateParams.profilePage === 'movie-watchlist') {
        getWatchlist();
        $scope.pageTitle = "My Movie Watchlist:"
        $scope.addWatchListBtn = false;
        $scope.delWatchListBtn = true;
        $scope.addFavBtn = true;
        $scope.delFavBtn = false;
    } else if ($stateParams.profilePage === 'favorite-movies') {
        $scope.pageTitle = "My Favorite Movies:"
        $scope.addWatchListBtn = true;
        $scope.delWatchListBtn = false;
        $scope.addFavBtn = false;
        $scope.delFavBtn = true;
        getFavoriteMovies();
    } else if ($stateParams.profilePage === 'movies-watched') {
        console.log("getting movies watched");
        // getMoviesWatched();
    }
    

}]);