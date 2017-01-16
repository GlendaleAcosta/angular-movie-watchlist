angular
    .module('myApp.about', ['ui.router'])
    .config(['$stateProvider', function($stateProvider){

    $stateProvider
            .state('about', {
                url: '/about',
                views: {
                    'navbar': {
                        templateUrl: 'navbar/navbar.html',
                        controller: 'navbarController'
                    },
                    'page': {
                        templateUrl: 'about/about.html',
                        controller: 'aboutController'
                    },
                    'footer': {
                        templateUrl: 'footer/footer.html',
                        controller: 'footerController'
                    }
                }
            })
    }])

    .controller('aboutController', ['$scope', function($scope){
        
        
    }]);