angular.module('myApp.home', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'main': {
                    templateUrl: 'home/home.html',
                    controller: 'homeController'
                }
            }
        })
}])

.controller('homeController', ['$scope', function($scope){
    
    
}]);