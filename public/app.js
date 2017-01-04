angular.module("myApp", [
    "ui.router",
    "myApp.home",
    "myApp.about",
    "myApp.catalog",
    "myApp.navbar",
    "myApp.login",
    "myApp.signup",
    "myApp.movie",
    "myApp.profile"
])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
        
        $urlRouterProvider.otherwise('/');

        // Allows for urls such as 'example.com/about' & 'example.com/about/'
        $urlRouterProvider.rule(function($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length-1] === '/';

            if(hasTrailingSlash) {

            //if last charcter is a slash, return the same url without the slash  
            var newPath = path.substr(0, path.length - 1); 
            return newPath; 
            } 

        });
        
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