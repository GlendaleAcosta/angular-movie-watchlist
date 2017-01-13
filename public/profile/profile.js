angular.module('myApp.profile', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('profile', {
            url: '/profile/:userId',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController'
                },
                'page': {
                    templateUrl: 'profile/profile.html',
                    controller: 'profileController'
                }
            }
        })
}])

.controller('profileController', ['$scope', '$http', 'auth' , function($scope, $http, auth){
    

    var api_key = '1cc7edd7a3b1549a1de32ac8a417a5e4';
    var getWatchlist = function(){

        $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            },
            url: '/watchlist'
        })
        .then(function(res){
            console.log(res.data.watchlist);
            var watchlist_arr = res.data.watchlist;
            var watchlist_length = watchlist_arr.length;
            
            for(var i = 0; i < watchlist_length; i++) {

                
                $scope.movieWatchlist = [];

                $http({
                    method: 'GET',
                    url: 'https://api.themoviedb.org/3/movie/' + watchlist_arr[i] + '?api_key=' + api_key + '&language=en-US'
                })
                .then(function(res){
                    console.log(res.data);
                    $scope.movieWatchlist.push(res.data);
                })
                .catch(function(err){

                })
            }
            

            // $http({
            //     method: 'GET',
            //     url: ''
            // })



        })
        .catch(function(err){

        })
    }

    getWatchlist();


}]);