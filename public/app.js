angular.module("myApp", [
    "ui.router",
    "myApp.home",
    "myApp.about",
    "myApp.catalog",
    "myApp.navbar",
    "myApp.login",
    "myApp.signup",
    "myApp.movie"
])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    
        $urlRouterProvider.otherwise('/');


        
        $locationProvider.html5Mode(true);
}]);