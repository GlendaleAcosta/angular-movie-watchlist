angular.module('myApp.profile', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('profile', {
            url: '/profile/:userId/:profilePage',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController'
                },
                'page': {
                    templateUrl: 'profile/profile.html',
                    controller: 'profileController',
                    resolve: {
                        validateProfilePage: function($stateParams, $state){
                            var profilePages = [
                                'movie-watchlist',
                                'favorite-movies',
                                'movies-watched']
                            var profilePages_length = profilePages.length;
                            var isValidPage = false;

                            for(var i = 0; i < profilePages_length; i++) {
                               if ($stateParams.profilePage === profilePages[i]) {
                                
                                   isValidPage = true;
                                   break;
                               } 
                            }
                            
                            if (isValidPage === false) {
                                $state.go('home');
                            }
                        }
                    }
                }
            }
        })
}])

.controller('profileController', ['$scope', '$http', '$stateParams', '$state' , 'auth' , function($scope, $http, $stateParams, $state ,auth){
    
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
                    url: 'https://api.themoviedb.org/3/movie/' + watchlist_arr[i] + '?api_key=' + api_key + '&language=en-US'
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
                    url: 'https://api.themoviedb.org/3/movie/' + favoriteMovies[i] + '?api_key=' + api_key + '&language=en-US'
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

    
    if ($stateParams.profilePage === 'movie-watchlist') {
        getWatchlist();
    } else if ($stateParams.profilePage === 'favorite-movies') {
        getFavoriteMovies();
    }

}]);