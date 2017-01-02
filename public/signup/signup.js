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

.controller('signupController', ['$scope', '$http', function($scope, $http){
    
    $scope.signUp = function(email, password){
        
        var user = {
            email: email,
            password: password
        }

        $http({
            method: 'POST',
            url: '/sign-up',
            data: user
        })
        .then(function(res){
            console.log(res.data);
        })
        .catch(function(err){
            console.log(err);
        })
    }
    
}]);