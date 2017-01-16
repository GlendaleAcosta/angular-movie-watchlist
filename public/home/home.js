angular.module('myApp.home', ['ui.router', 'ngAnimate'])

.config(['$stateProvider', function($stateProvider){

    $stateProvider
        .state('home', {
            url: '/',
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
                    templateUrl: 'home/home.html',
                    controller: 'homeController'
                }
            }
        })

}])

.controller('homeController', ['$scope', '$interval' , '$timeout', function($scope, $interval, $timeout){

    $scope.imgSrc1 = '../images/main_bg.jpg';
    $scope.imgSrc2 = '../images/rogue_one_bg.jpg';
    $scope.imgSrc3 = '../images/moana_bg1.jpg';

    var slide = 1; 
    $scope.zIndex1 = 5;
    $scope.zIndex2 = 5;
    $scope.zIndex3 = 0;
    // Super basic Slideshow
    $interval(function(){
        if (slide === 1) {

        $scope.opac1 = 0;
        $scope.opac2 = 1;
        $scope.opac3 = 1;

        $scope.zIndex1 = 5;
        $scope.zIndex2 = 5;
        $scope.zIndex3 = 0;

        slide = 2;
        
        } else if (slide === 2) {
            $scope.opac1 = 1;
            $scope.opac2 = 0;
            $scope.opac3 = 1;

            $scope.zIndex1 = 0;
            $scope.zIndex2 = 5;
            $scope.zIndex3 = 5;

            slide = 3;

        } else if (slide === 3) {
            $scope.opac1 = 1;
            $scope.opac2 = 1;
            $scope.opac3 = 0;

            $scope.zIndex1 = 0;
            $scope.zIndex2 = 0;
            $scope.zIndex3 = 5;

            slide = 1;

        }

    }, 6000)
    
}]);