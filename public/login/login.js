angular.module('myApp.login', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'page': {
                    templateUrl: 'login/login.html',
                    controller: 'loginController'
                }
            }
        })

}])

.controller('loginController', ['$scope', function($scope){
    
    
}]);