/*jshint -W099*/

/**
 * iMetric
 * @module presentation/timeUse/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2Services = angular.module('UBIDriver.modules.dashboard.presentations.timeUse.services', [])

    /**
     * @constructor TimeUseService
     * @memberOf module:presentation/timeUse
     */
    .factory('TimeUseService', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {
            /**
             * @function getTimeUseData
             * @author Alex Boisselle
             * @memberOf module:presentation/timeUse.TimeUseService
             * @description gets timeUse data for currently selected machines
             */
            getTimeUseData: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/time-of-use/?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    timeUse;

                timeUse = STUB.TIME_USE;

                var req = {
                    method: 'GET',
                    url: url,
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                .success(function(data, status, headers, config){
                    q.resolve(data);
                })
                .error(function(data, status, headers, config){
                    q.reject(status);
                });

                //$timeout(function(){
                //
                //    q.resolve(timeUse);
                //
                //}, 500);

                return q.promise;
            },
            /**
             * @function getTimeUseDataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/timeUse.TimeUseService
             * @description gets timeUse data for currently selected machines
             */
            getTimeUseDataAverage: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/time-of-use/average?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    timeUseAverage;

                timeUseAverage = STUB.TIME_USE_AVERAGE;

                var req = {
                    method: 'GET',
                    url: url,
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                .success(function(data, status, headers, config){
                    q.resolve(data);
                })
                .error(function(data, status, headers, config){
                    q.reject(status);
                });

                //$timeout(function(){
                //
                //    q.resolve(timeUseAverage);
                //
                //}, 500);

                return q.promise;
            }
        };
    }]);
})();