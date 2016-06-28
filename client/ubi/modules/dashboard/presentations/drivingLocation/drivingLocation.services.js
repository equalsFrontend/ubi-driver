/*jshint -W099*/

/**
 * iMetric
 * @module presentation/drivingLocation/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2Services = angular.module('UBIDriver.modules.dashboard.presentations.drivingLocation.services', [])

    /**
     * @constructor DrivingLocationService
     * @memberOf module:presentation/drivingLocation
     */
    .factory('DrivingLocationService', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {
            /**
             * @function getDrivingLocationData
             * @author Alex Boisselle
             * @memberOf module:presentation/drivingLocation.DrivingLocationService
             * @description gets drivingLocation data for currently selected machines
             */
            getDrivingLocationData: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/driving-location/?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    drivingLocation;

                //drivingLocation = STUB.DRIVING_LOCATION;

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
                //    q.resolve(drivingLocation);
                //}, 500);

                return q.promise;
            },
            /**
             * @function getDrivingLocationDataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/drivingLocation.DrivingLocationService
             * @description gets drivingLocation average data for currently selected machines
             */
            getDrivingLocationDataAverage: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/driving-location/average?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    drivingLocationAverage;

                //drivingLocationAverage = STUB.DRIVING_LOCATION_AVERAGE;

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
                //    q.resolve(drivingLocationAverage);
                //}, 500);

                return q.promise;
            }
        };
    }]);
})();