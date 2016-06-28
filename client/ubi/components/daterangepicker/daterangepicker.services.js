/*jshint -W099*/

/**
 * iMetric
 * @module presentation/daterangepicker.services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var bingServices = angular.module('UBIDriver.components.daterangepicker.services', [])

    .factory('daterangepickerService', ['$q', '$rootScope', function($q, $rootScope){
        return {
            init: function(){
                if(!this.Microsoft){
                    this.Microsoft = true;
                }
            }
        };
    }]);
})();