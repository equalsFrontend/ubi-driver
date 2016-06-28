/*jshint -W099*/

/**
 * iMetric
 * @module presentation/speed/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var speedServices = angular.module('UBIDriver.modules.dashboard.presentations.speed.services', [])

    /**
     * @constructor SpeedService
     * @memberOf module:presentation/speed
     */
    .factory('SpeedService', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {

            /**
             * @function getSpeedData
             * @author Alex Boisselle
             * @memberOf module:presentation/speed.SpeedService
             * @description gets mileage data for currently selected machines
             */
            getSpeedData: function(granularity) {

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/speed?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    speed;

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
                //    q.resolve(speed);
                //
                //}, 500);

                return q.promise;
            },

            /**
             * @function getSpeedDataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/speed.SpeedService
             * @description gets mileage data for currently selected machines
             */
            getSpeedDataAverage: function(granularity) {

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/speed/average' + '?granularity=' + granularity + '&token=' + token + '&startDate=' + startDate + '&endDate=' + endDate,
                    speedAverage;

                //speedAverage = STUB.SPEED_AVERAGE;

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
                //    q.resolve(speedAverage);
                //
                //}, 500);

                return q.promise;
            }
        };
    }]);
})();