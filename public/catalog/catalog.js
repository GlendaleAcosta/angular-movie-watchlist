angular.module('myApp.catalog', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('catalog', {
            url: '/catalog',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController',
                    resolve: {
                        authenticate: function(auth){
                            var token = auth.getToken();
                            if (token !== undefined) {
                                auth.authenticate(token);
                            }   
                        }
                    }
                },
                'page': {
                    templateUrl: 'catalog/catalog.html',
                    controller: 'catalogController' 
                },
                'footer': {
                    templateUrl: 'footer/footer.html',
                    controller: 'footerController'
                }
            }
        })

}])

.controller('catalogController', ['$scope', '$http', '$timeout', 'TMDB_API_KEY', function($scope, $http, $timeout, TMDB_API_KEY){
    

    $scope.onSearch = function(title){
        
        $scope.titleResult = title;
        $scope.genreResult = null;
        $scope.popularResult = null;

        $http({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_API_KEY + '&language=en-US&query=' + title + '&page=1&include_adult=false' 
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
            url: 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + TMDB_API_KEY + '&language=en-US'
        })
            .then(function(res){
                
                var genres_arr = res.data.genres;
                var genres_length = genres_arr.length;
                $scope.genres = genres_arr;


    

            }, function(err){
                console.log(err);
            })
    }

    getGenres();

    var getPopularGenres = function(){

        $scope.popularResult = "Popular";

        $http({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/popular?api_key=' + TMDB_API_KEY + '&language=en-US&page=1'
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
            url: 'https://api.themoviedb.org/3/genre/' + genreId + '/movies?api_key=' + TMDB_API_KEY + '&language=en-US&include_adult=false&sort_by=created_at.asc'
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
    

    $scope.selectMovie = function($index){
        $scope.movieId = $scope.movies[$index].id
    }
   
}])
