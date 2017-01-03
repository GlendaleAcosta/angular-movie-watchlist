angular.module('myApp.navbar', ['ui.router'])


.controller('navbarController', ['$scope', 'navData', 'auth', '$http' ,function($scope, navData, auth, $http){

    
    
    
    var tokenJWT = auth.getToken();
    if (tokenJWT !== undefined) {
        var data = {
            token: tokenJWT
        }
        $http({
            method: 'POST',
            url: '/authenticate',
            data: data
        })
        .then(function(res){
            
            $scope.email = res.data.email;
            $scope.isLoggedIn = true;
        })
        .catch(function(err){

        })
        // var user = navData.getUser();
        // $scope.email = user.email;

    } else {
        $scope.isLoggedIn = false;
    }

    

}]);