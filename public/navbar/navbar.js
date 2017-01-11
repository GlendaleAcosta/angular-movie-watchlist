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
            console.log(res.data);
            $scope.userId = res.data.user.id;
            $scope.email = res.data.user.email;
            $scope.isLoggedIn = true;
        })
        .catch(function(err){

        })
        // var user = navData.getUser();
        // $scope.email = user.email;

    } else {
        $scope.isLoggedIn = false;
    }

    $scope.enterDropdown = function(){
        $scope.dropdown = true;
        // $scope.dropdownDisplay = 'block !important';
        
    }

    $scope.leaveDropdown = function(){
        $scope.dropdown = false;
    }

    $scope.logout = function(){
        auth.logout();
        $scope.isLoggedIn = false;
    }

}]);