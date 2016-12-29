angular.module("myApp", [
    "ui.router",
    "myApp.home"
])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    
        $urlRouterProvider.otherwise('/');
        
}]);