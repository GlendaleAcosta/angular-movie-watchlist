angular.module('myApp.profile', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('profile', {
            url: '/profile/:profileId',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController'
                },
                'page': {
                    templateUrl: 'profile/profile.html',
                    controller: 'profileController'
                }
            }
        })
}])

.controller('profileController', ['$scope', function($scope){
    
    
}]);