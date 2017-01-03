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
}])



.service('auth', [ '$window' , '$http', function($window, $http){
    
    this.getToken = function(){
        return $window.sessionStorage['watchlist-token'];
    }

    this.setToken = function(token) {
        $window.sessionStorage['watchlist-token'] = token;
    }

    this.logout = function() {
        $window.sessionStorage.removeItem('watchlist-token');
    }
}])


.service('navData', function(){
    
    this.user = null;

    this.setUser = function(user) {
        this.user = user;
    }

    this.getUser = function() {
        return this.user;
    }

});