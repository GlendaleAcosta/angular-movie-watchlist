angular.module('myApp.signup', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('sign-up', {
            url: '/sign-up',
            views: {
                'page': {
                    templateUrl: 'signup/signup.html',
                    controller: 'signupController',
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

.controller('signupController', ['$scope', '$http', '$state' , 'validateUser' ,function($scope, $http, $state ,validateUser){
    
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
            $scope.msg = res.data.msg;
            $state.go('login');
        })
        .catch(function(err){
            console.log("ERROR");
            console.log(err);
            $scope.msg = err.data.msg;
        })
    }
    
}]);
