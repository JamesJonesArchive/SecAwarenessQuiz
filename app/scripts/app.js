(function (window, angular, undefined) {
    'use strict';

    angular
    .module('saqApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/saq.html',
                controller: 'saqCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(window, window.angular);
