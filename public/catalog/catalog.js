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

.controller('catalogController', ['$scope', '$http', function($scope, $http){
    
    $scope.movies = [
        {
            title: "Men in black",
            rating: 5
        },
        {
            title: "Moana",
            rating: 8
        },
        {
            title: "Stranger Things",
            rating: 11
        },
        {
            title: "Zootopia",
            rating: 8.3
        },
        {
            title: "Groundhog Day",
            rating: 9
        }
    ]




    // imdb api key: edb9cf13-36f4-47e8-a724-e6bcdd1148d5
    // http://imdb.wemakesites.net/#anhcor-search-imdb
}]);