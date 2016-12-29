angular.module('myApp.catalog', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

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

}])

.controller('catalogController', ['$scope', function($scope){
    
    
}]);