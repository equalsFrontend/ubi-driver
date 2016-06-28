/*jshint -W099*/

/**
 * iMetric
 * @module components/daterangepicker/directives
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    /**
     * Setup of daterangepicker Component
     *
     */
    var daterangepickerModule = angular.module('UBIDriver.components.daterangepicker.directives',[])

    .directive('dateRangePicker', ['$rootScope',
                                   'daterangepickerService',
                                   'PATHS', function($rootScope,
                                                     daterangepickerService,
                                                     PATHS) {

        var dir = {
            restrict: "E",
            templateUrl: PATHS.DATERANGEPICKER + 'daterangepicker.view.html',
            link: function(scope, element){
                //daterangepickerService.init(); //connects to API
            }
        };

        return dir;
    }]);
})();