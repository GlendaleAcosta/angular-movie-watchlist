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

.controller('loginController', ['$scope', '$http' , function($scope, $http){
    
    $scope.login = function(email, password){
        
        var user = {
            email: email,
            password: password
        }

        $http({
            method: 'POST',
            url: '/login',
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