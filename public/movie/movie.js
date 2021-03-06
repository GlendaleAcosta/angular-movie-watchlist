angular.module('myApp.movie', ['ui.router'])

.config(['$stateProvider', function($stateProvider){

   $stateProvider
        .state('movie', {
            url: '/movie/:movieId',
            views: {
                'navbar': {
                    templateUrl: 'navbar/navbar.html',
                    controller: 'navbarController',
                    resolve: {
                        authenticate: function($http, auth){
                            var token = auth.getToken();
                            if (token !== undefined) {
                                auth.authenticate(token);
                            }   
                        }
                    }
                },
                'page': {
                    templateUrl: 'movie/movie.html',
                    controller: 'movieController'
                },
                'footer': {
                    templateUrl: 'footer/footer.html',
                    controller: 'footerController'
                },
                'btmMsgModal': {
                    templateUrl: 'components/bottomMsgModal/bottomMsgModal.html',
                    controller: 'btmMsgModalController'
                }
            
            }
        })

}])

.controller('movieController', ['$scope', '$stateParams', '$http', '$sce', 'auth' ,function($scope, $stateParams, $http, $sce, auth){
    
    var api_key = '1cc7edd7a3b1549a1de32ac8a417a5e4'
    $http({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + $stateParams.movieId + '?api_key=' + api_key + '&language=en-US'
    })
        .then(function(res){
            
            $scope.genres = res.data.genres;
            $scope.overview = res.data.overview;
            $scope.poster_path = res.data.poster_path;       
            $scope.movieTitle = res.data.title;
            $scope.backdrop = res.data.backdrop_path;

            $scope.rating = res.data.vote_average;
            $scope.release_date = res.data.release_date;
            $scope.titleReleaseDate = $scope.release_date.substring(0,4);
            
            $scope.myObj = {
                'background-image' : "url('http://image.tmdb.org/t/p/w1280/" + $scope.backdrop + "')"
            }
            
            
        }, function(err){
            console.log(err);
        })

    $http({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + $stateParams.movieId + '/credits?api_key=' + api_key
    })
        .then(function(res){
            
            var cast_arr = res.data.cast;
            var cast_length = cast_arr.length;
            cast_arr.splice(4, cast_length);
            
            $scope.castMembers = cast_arr;
            
        }, function(err){
            console.log(err);
        })


    $http({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + $stateParams.movieId + '/videos?api_key=' + api_key + '&language=en-US'
    })
        .then(function(res){
            
            $scope.videos = res.data.results;
            console.log($scope.videos);
            $scope.youtubeKey = res.data.results["0"].key;
            $scope.videoSrc = 'https://www.youtube.com/embed/' + $scope.youtubeKey;
        }, function(err){
            console.log(err);
        })


        // Movie-Header PARALLAX
        
        var posY = (window.scrollY);
        document.getElementsByClassName('movie-header')["0"].style.backgroundPositionY =  '-' + (posY/2.3) + 'px';
        
        // Very messy darking parallax shiet
        var alpha = posY / 450;
        if (alpha < 0.74 && alpha >= 0) {
            if (alpha < 0.3) {
                document.getElementsByClassName('darken-parallax')["0"].style.backgroundColor = 'rgba(0,0,0,0.3)';    
            } else {
                document.getElementsByClassName('darken-parallax')["0"].style.backgroundColor = 'rgba(0,0,0,' + alpha + ')';
            }
        }

        window.onscroll = function(){
            // Parallax    
            posY = window.scrollY;
            document.getElementsByClassName('movie-header')["0"].style.backgroundPositionY =  '-' + (posY/2.3) + 'px';

            // more messy darkening parallax shiet
            alpha = posY / 450;
            if (alpha < 0.74 && alpha >= 0) {
                if (alpha < 0.3) {
                    document.getElementsByClassName('darken-parallax')["0"].style.backgroundColor = 'rgba(0,0,0,0.3)';    
                } else {
                    document.getElementsByClassName('darken-parallax')["0"].style.backgroundColor = 'rgba(0,0,0,' + alpha + ')';
                }
            }
        }

        $scope.playVideo = function(videoKey){
            $scope.videoSrc = 'https://www.youtube.com/embed/' + videoKey;
            // $scope.trailerUrl();
            $scope.videoModal = true;
        }
        $scope.trailerUrl = function(videoSrc) {
            return $sce.trustAsResourceUrl(videoSrc);
        }

        $scope.addToWatchlist = function(){
            
            var movieId = $stateParams.movieId;
            
            $http({
                method: 'POST',
                data: {
                    movieId : movieId,
                    token: auth.getToken()
                },
                url: '/watchlist'
            })
                .then(function(res){
                    console.log(res.data);
                    $scope.successfullyAdded = res.data.hasAddedToWatchlist;
                    
                    if ($scope.successfullyAdded === true) {
                        $scope.alertStatus = 'alert-success';
                        $scope.modalSuccess = "Success";
                    } else {
                        $scope.alertStatus = 'alert-danger';
                        $scope.modalSuccess = "Failed";
                    }
                    $scope.modalMsg = res.data.msg;
                })
                .catch(function(err){

                })
        }
        

        $scope.addToFavorites = function(){
            var movieId = $stateParams.movieId;
            
            $http({
                method: 'POST',
                data: {
                    movieId: movieId,
                    token: auth.getToken()
                },
                url: '/favorites'
            })
            .then(function(res){
                console.log(res.data);
                $scope.successfullyAdded = res.data.hasAddedToFavorites;
                console.log($scope.successfullyAdded);
                if ($scope.successfullyAdded === true) {
                    $scope.alertStatus = 'alert-success';
                    $scope.modalSuccess = "Success";
                } else {
                    $scope.alertStatus = 'alert-danger';
                    $scope.modalSuccess = "Failed";
                }
                $scope.modalMsg = res.data.msg;
            })
            .catch(function(err){
                console.log(err);
            })
        }

        $scope.exitModal = function(){
            
            $scope.modalMsg = null;
        }

        $scope.exitVideoModal = function(){
            
            $scope.videoModal = null;
        }

}]);