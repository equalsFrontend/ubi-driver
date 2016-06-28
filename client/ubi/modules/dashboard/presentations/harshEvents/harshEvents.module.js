/*jshint -W099*/

/**
 * iMetric
 * @module presentation/harshEvents
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var harshEventsModule = angular.module('UBIDriver.modules.dashboard.presentations.harshEvents',[
        'UBIDriver.modules.dashboard.presentations.harshEvents.controllers',
        'UBIDriver.modules.dashboard.presentations.harshEvents.services',
        'UBIDriver.components.bing'
    ])

    .config(['$stateProvider', '$urlRouterProvider', 'PATHS', function($stateProvider, $urlRouterProvider, PATHS) {

        //$stateProvider
        //.state('dashboard', {
        //    url: '/dashboard',
        //    views: {
        //        'main': {
        //            templateUrl: PATHS.DASHBOARD + 'dashboard.view.html',
        //            controller: 'DashboardController as dashboard'
        //        }
        //    }
        //});
    }]);
})();