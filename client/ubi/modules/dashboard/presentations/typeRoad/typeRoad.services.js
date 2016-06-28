/*jshint -W099*/

/**
 * iMetric
 * @module presentation/typeRoad/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2Services = angular.module('UBIDriver.modules.dashboard.presentations.typeRoad.services', [])

    /**
     * @constructor TypeRoadService
     * @memberOf module:presentation/typeRoad
     */
    .factory('TypeRoadService', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {
            /**
             * @function getTypeRoadData
             * @author Alex Boisselle
             * @memberOf module:presentation/typeRoad.TypeRoadService
             * @description gets typeRoad data for currently selected machines
             */
            getTypeRoadData: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/type-of-road/?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    typeRoad;

                //typeRoad = STUB.TYPE_ROAD;

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
                //    q.resolve(typeRoad);
                //
                //}, 500);

                return q.promise;
            },
            /**
             * @function getTypeRoadDataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/typeRoad.TypeRoadService
             * @description gets typeRoad data for currently selected machines
             */
            getTypeRoadDataAverage: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/type-of-road/average?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity,
                    typeRoadAverage;

                //typeRoadAverage = STUB.TYPE_ROAD_AVERAGE;

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
                //    q.resolve(typeRoadAverage);
                //
                //}, 500);

                return q.promise;
            }
        };
    }]);
})();