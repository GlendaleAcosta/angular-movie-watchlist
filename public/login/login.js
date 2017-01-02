angular.module('myApp.login', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'page': {
                    templateUrl: 'login/login.html',
                    controller: 'loginController',
                    resolve: {
                        validateUser : function(auth, $location) {
                            if (auth.getToken() !== undefined) {
                                $state.go('home');
                            }
                        }
                    }
                }
            }
        })

}])

.controller('loginController', ['$scope', '$http', '$location' , 'auth', 'validateUser' , function($scope, $http, $location ,auth, validateUser){

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
            $scope.isLoggedIn = res.data.isLoggedIn;
            auth.setToken(res.data.token);
            console.log($scope.isLoggedIn);
            if ($scope.isLoggedIn === true) {
                $state.go('home');
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }


}]);