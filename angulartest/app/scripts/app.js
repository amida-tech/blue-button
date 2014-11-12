"use strict";

var bbTesting = angular.module('bbTesting', ['ngRoute']);

bbTesting.config(function ($routeProvider) {
    $routeProvider.when('/run', {
        templateUrl: 'templates/detail.html',
        controller: 'ParserCtrl'
    });
});