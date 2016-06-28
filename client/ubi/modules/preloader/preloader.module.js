/*jshint -W099*/

/**
 * iMetric
 * @module preloader
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    /**
     * @constructor module
     * @memberOf module:preloader
     */
    var PreloaderModule = angular.module('UBIDriver.modules.preloader',[
        'UBIDriver.modules.preloader.controllers',
        'UBIDriver.modules.preloader.services'
    ])

    .config(['$stateProvider', '$urlRouterProvider', 'PATHS', function($stateProvider, $urlRouterProvider, PATHS) {

         $stateProvider
         .state('loading', {
             url: '/loading',
             views: {
                 'main': {
                     templateUrl: PATHS.PRELOADER + 'preloader.view.html',
                     controller: 'PreloaderController as preloader'
                 }
             }
         });

    }])

    .run(["localStorageService", "$rootScope", function(localStorageService, $rootScope){

    }]);
})();