angular.module('myApp.signup', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('signup', {
            url: '/sign-up',
            views: {
                'page': {
                    templateUrl: 'signup/signup.html',
                    controller: 'signupController'
                }
            }
        })

}])

.controller('signupController', ['$scope', function($scope){
    
    
}]);