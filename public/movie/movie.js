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
    
}]);