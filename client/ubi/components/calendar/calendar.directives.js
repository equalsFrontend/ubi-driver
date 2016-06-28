/*jshint -W099*/

/**
 * iMetric
 * @module components/calendar/directives
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var CalendarDirectivesModule = angular.module('UBIDriver.components.calendar.directives',[])

    .directive('calendar', ['$rootScope', 'PATHS', function($rootScope, PATHS) {

        var dir = {
            restrict: "E",
            templateUrl: PATHS.CALENDAR + 'calendar.view.html',
            link: function(scope, element){
                //console.log(element);

                //daterangepickerService.init(); //connects to API
            }
        };

        return dir;
    }]);

})();