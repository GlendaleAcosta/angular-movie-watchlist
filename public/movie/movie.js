angular.module('myApp.movie', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('movie', {
            url: '/movie/:movieId',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController'
                },
                'page': {
                    templateUrl: 'movie/movie.html',
                    controller: 'movieController'
                }
            }
        })

}])

.controller('movieController', ['$scope', '$stateParams', '$http' ,function($scope, $stateParams, $http){
    console.log("Passed Number: " + $stateParams.movieId);
    var api_key = '1cc7edd7a3b1549a1de32ac8a417a5e4'
    $http({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + $stateParams.movieId + '?api_key=' + api_key + '&language=en-US'
    })
        .then(function(res){
            console.log(res.data);       
            $scope.movieTitle = res.data.title;
            $scope.backdrop = res.data.backdrop_path;
            $scope.myObj = {
                'background-image' : "url('http://image.tmdb.org/t/p/w1280/" + $scope.backdrop + "')"
            }

            
        }, function(err){
            console.log(err);
        })

    $http({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + $stateParams.movieId + '/credits?api_key=' + api_key
    })
        .then(function(res){
            console.log(res.data.cast);
            var cast_arr = res.data.cast;
            var cast_length = cast_arr.length;
            cast_arr.splice(4, cast_length);
            console.log(cast_arr);
            $scope.castMembers = cast_arr;
            
        }, function(err){
            console.log(err);
        })


        // Movie-Header PARALLAX
        
        var posY = (window.scrollY);
        document.getElementsByClassName('movie-header')["0"].style.backgroundPositionY =  '-' + (posY/2.3) + 'px';
        
        
        var alpha = posY / 550;
        if (alpha < 0.5 && alpha >= 0) {
            document.getElementsByClassName('darken-parallax')["0"].style.backgroundColor = 'rgba(0,0,0,' + alpha + ')';
        }

        window.onscroll = function(){   
            posY = window.scrollY;
            document.getElementsByClassName('movie-header')["0"].style.backgroundPositionY =  '-' + (posY/2.3) + 'px';

            alpha = posY / 550;
            if (alpha < 0.5 && alpha >= 0) {
                document.getElementsByClassName('darken-parallax')["0"].style.backgroundColor = 'rgba(0,0,0,' + alpha + ')';
            }
        }
        


}]);