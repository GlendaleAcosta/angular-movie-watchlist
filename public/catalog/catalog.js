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
    

    $scope.onSearch = function(title){
        
        var api_key = '1cc7edd7a3b1549a1de32ac8a417a5e4';

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

    

    $scope.equalHeight = function(){
        
        var images_arr = document.getElementsByTagName('img');
        var images_length = images_arr.length;
        console.log(images_arr);
        var smallestHeight = 9999;

        for(var i = 0; i < images_length; i++) {
            // console.log("images_arr[" + i + "] height: " + images_arr[i].height);

            if (images_arr[i].height < smallestHeight) {
            
            smallestHeight = images_arr[i].height;
            
            }
        }

        for(var i = 0; i < images_length; i++) {
            // console.log("images_arr[" + i + "] height: " + images_arr[i].height);
            // images_arr[i].height = smallestHeight;
            console.log(smallestHeight);
            // console.log(images_arr[i].height);
            images_arr[i].style.maxHeight = smallestHeight + "px";
            images_arr[i].style.width = "100%";
        }
        
        // Make every img height the same

    }


    
    // imdb api key: edb9cf13-36f4-47e8-a724-e6bcdd1148d5
    // http://imdb.wemakesites.net/#anhcor-search-imdb
}])
