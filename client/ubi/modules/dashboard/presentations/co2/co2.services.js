/*jshint -W099*/

/**
 * iMetric
 * @module presentation/co2/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2Services = angular.module('UBIDriver.modules.dashboard.presentations.co2.services', [])

    /**
     * @constructor Co2Service
     * @memberOf module:presentation/co2
     */
    .factory('Co2Service', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {
            /**
             * @function getCo2Data
             * @author Alex Boisselle
             * @memberOf module:presentation/co2.Co2Service
             * @description gets co2 data for currently selected machines
             */
            getCo2Data: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/co2/?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    co2;

                co2 = STUB.CO2;

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

                return q.promise;
            },
            /**
             * @function getCo2DataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/co2.Co2Service
             * @description gets co2 data for currently selected machines
             */
            getCo2DataAverage: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/co2/average' + '?granularity=' + granularity + '&token=' + token + '&startDate=' + startDate + '&endDate=' + endDate,
                    co2Average;

                co2Average = STUB.CO2_AVERAGE;

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

                return q.promise;
            }
        };
    }]);
})();