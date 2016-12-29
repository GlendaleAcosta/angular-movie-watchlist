angular.module('myApp.home', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController'
                },
                'page': {
                    templateUrl: 'home/home.html',
                    controller: 'homeController'
                }
            }
        })

}])

.controller('homeController', ['$scope', function($scope){
    

    
}]);