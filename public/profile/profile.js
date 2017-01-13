angular.module('myApp.profile', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('profile', {
            url: '/profile/:userId',
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

.controller('profileController', ['$scope', '$http', 'auth' , function($scope, $http, auth){
    
    var getWatchlist = function(){

        $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            },
            url: '/watchlist'
        })
        .then(function(res){
            console.log(res);
        })
        .catch(function(err){

        })
    }

    getWatchlist();


}]);