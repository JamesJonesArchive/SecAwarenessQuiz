(function (window, angular, undefined) {
    'use strict';

    angular
    .module('e911App', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/e911.html',
                controller: 'e911Ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(window, window.angular);
