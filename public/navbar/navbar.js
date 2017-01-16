angular.module('myApp.navbar', ['ui.router'])


.controller('navbarController', ['$scope', 'navData', 'auth', '$http', '$state' ,function($scope, navData, auth, $http, $state){

    
    
    if (navData.getUser() !== null && navData.getUser() !== undefined) {
        
        var user = navData.getUser();
        $scope.isLoggedIn = true;
        $scope.email = user.email;
        $scope.userId = user.id;
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
        navData.setUser(null);
        $scope.isLoggedIn = false;
        $state.go('home');
    }

}]);