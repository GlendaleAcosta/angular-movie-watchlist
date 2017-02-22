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

.controller('loginController', ['$scope', '$http', '$location', '$state' , 'auth', 'validateUser', 'navData' , function($scope, $http, $location, $state ,auth, validateUser, navData){

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
            var user = res.data.user;
            $scope.isLoggedIn = res.data.isLoggedIn;
            $scope.msg = res.data.msg;
            
            if ($scope.isLoggedIn === true) {
                auth.setToken(res.data.token);
                navData.setUser(user);
                console.log(navData.getUser());
                $state.go('home');
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }


}]);