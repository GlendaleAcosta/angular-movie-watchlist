angular.module('myApp.catalog', ['ui.router'])

.config(['$stateProvider', '$httpProvider', function($stateProvider, $httpProvider){

   $stateProvider
        .state('catalog', {
            url: '/catalog',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController'
                },
                'page': {
                    templateUrl: 'catalog/catalog.html',
                    controller: 'catalogController'
                }
            }
        })

    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

}])

.controller('catalogController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
    
    var api_key = '1cc7edd7a3b1549a1de32ac8a417a5e4';

    

    $scope.onSearch = function(title){
        
        $scope.titleResult = title;
        $scope.genreResult = null;
        $scope.popularResult = null;

        $http({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&language=en-US&query=' + title + '&page=1&include_adult=false' 
        })
            .then(function(res){
                // console.log(res.data.results);
                $scope.movies = res.data.results;
                
                $timeout(function(){
                    
                    var images_arr = document.getElementsByTagName('img');
                    var images_length = images_arr.length;

                    for(var i = 0; i < images_length; i++) {

                        var src = images_arr[i].src;
                        var isNull = src.endsWith('null'); 
                        if (isNull) {
                            images_arr[i].src = '../images/default_img.jpg';
                        }
                    }


                }, 500);
                
                
            },function(err){
                console.log(err);
            })
    }

    var getGenres = function(){
    $scope.genres = [];

        $http({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + api_key + '&language=en-US'
        })
            .then(function(res){
                
                var genres_arr = res.data.genres;
                var genres_length = genres_arr.length;
                $scope.genres = genres_arr;
                console.log(genres_arr);
                console.log(genres_length);

    

            }, function(err){
                console.log(err);
            })
    }

    getGenres();

    var getPopularGenres = function(){

        $scope.popularResult = "Popular";

        $http({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/popular?api_key=' + api_key + '&language=en-US&page=1'
        })
            .then(function(res){
                $scope.movies = res.data.results;

                $timeout(function(){
                    
                    var images_arr = document.getElementsByTagName('img');
                    var images_length = images_arr.length;

                    for(var i = 0; i < images_length; i++) {

                        var src = images_arr[i].src;
                        var isNull = src.endsWith('null'); 
                        if (isNull) {
                            images_arr[i].src = '../images/default_img.jpg';
                        }
                    }


                }, 500);

            }, function(err){
                console.log(err);
            })

            
    }

    getPopularGenres();
    
    $scope.selectGenre = function($index){
        
        $scope.genreResult = $scope.genres[$index].name;
        $scope.titleResult = null;
        $scope.popularResult = null;
        
        var genreId = $scope.genres[$index].id;
        $http({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/genre/' + genreId + '/movies?api_key=' + api_key + '&language=en-US&include_adult=false&sort_by=created_at.asc'
        })
            .then(function(res){
                console.log(res.data);
                $scope.movies = res.data.results;

                $timeout(function(){
                    
                    var images_arr = document.getElementsByTagName('img');
                    var images_length = images_arr.length;

                    for(var i = 0; i < images_length; i++) {

                        var src = images_arr[i].src;
                        var isNull = src.endsWith('null'); 
                        if (isNull) {
                            images_arr[i].src = '../images/default_img.jpg';
                        }
                    }


                }, 500);

            }, function(err){
                console.log(err);
            })
    }
    

    $scope.selectMovie = function($index){
        $scope.movieId = $scope.movies[$index].id
    }
    // imdb api key: edb9cf13-36f4-47e8-a724-e6bcdd1148d5
    // http://imdb.wemakesites.net/#anhcor-search-imdb


// https://api.themoviedb.org/3/genre/28/movies?api_key=1cc7edd7a3b1549a1de32ac8a417a5e4&language=en-US&include_adult=false&sort_by=created_at.asc
//https://api.themoviedb.org/3/genre/4movies?api_key=1cc7edd7a3b1549a1de32ac8a417a5e4&language=en-US&include_adult=false&sort_by=created_at.asc 
}])
