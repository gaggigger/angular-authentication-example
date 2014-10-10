angular.module('app', [
    'ngRoute',

    // Top level modules only
    'auth',
    'login',
    'pets'
])

    .config(['$compileProvider', '$routeProvider', '$locationProvider', function ($compileProvider, $routeProvider, $locationProvider){
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

        $routeProvider
            .when('/login', {
                templateUrl: 'app/login/login.tpl.html',
                controller: 'LoginCtrl',

                // You do not need to be logged in to go to this route.
                requireLogin: false
            })

            .when('/pets', {
                templateUrl: 'app/pets/pets.tpl.html',
                controller: 'PetsCtrl',

                // You must be logged into go to this route.
                requireLogin: true
            })

            .when('/pet/:petId', {
                templateUrl: 'app/pets/pet/pet.tpl.html',
                controller: 'PetCtrl',
                requireLogin: true
            });

        // If the url is unrecognized go to login
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    }])

    .run(['$rootScope', 'AuthService', '$location', function($rootScope, AuthService, $location){
        // Everytime the route in our app changes check auth status
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            // if you're logged out send to login page.
            if (next.requireLogin && !AuthService.getUserAuthenticated()) {
                $location.path('/login');
                event.preventDefault();
            }
        });
    }])

    .controller('MainCtrl', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
        $scope.logoutUser = function() {
            // run a logout function to your api
            AuthService.setUserAuthenticated(false);
            $location.path('/login');
        };

        $scope.isLoggedIn = function() {
            return AuthService.getUserAuthenticated();
        };
    }]);
