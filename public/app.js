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

.config(['$stateProvider', '$urlRouterProvider','$locationProvider', '$httpProvider' , function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
        
        $urlRouterProvider.otherwise('/');

        // Redirects www.example.com/about/ to www.example.com/about
        $urlRouterProvider.rule(function($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length-1] === '/';

            if(hasTrailingSlash) {

            //if last charcter is a slash, return the same url without the slash  
            var newPath = path.substr(0, path.length - 1); 
            return newPath; 
            } 

        });
        
        // Allows for pretty urls
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };


}])
.constant('TMDB_API_KEY', '1cc7edd7a3b1549a1de32ac8a417a5e4')

.service('auth', [ '$window', '$http', 'navData', function($window, $http, navData){
    this.authenticate = function(token){
        
        $http({
            method: 'POST',
            data: {
                token: token
            },
            url: '/authenticate'
        })
        .then(function(res){

           var user = res.data.user;
           navData.setUser(user);
           return user;
            
            
        })
        .catch(function(err){
            console.log(err);
        })
        
    }
    
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

