/*jshint -W099*/

/**
 * iMetric
 * @module presentation/harshEvents
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2Services = angular.module('UBIDriver.modules.dashboard.presentations.harshEvents.services', [])

    /**
     * @constructor HarshEventsService
     * @memberOf module:presentation/harshEvents
     */
    .factory('HarshEventsService', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {

            /**
             * @function gethHarshEventsData
             * @author Alex Boisselle
             * @memberOf module:presentation/harshEvents.HarshEventsService
             * @description gets harshEvents data for currently selected machines
             */
            getHarshEventsData: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/harsh-events/?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity + '&eventsDetails=false',
                    harshEvents;

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
                //    q.resolve(harshEvents);
                //
                //}, 500);

                return q.promise;
            },
            /**
             * @function gethHarshEventsTable
             * @author Alex Boisselle
             * @memberOf module:presentation/harshEvents.HarshEventsService
             * @description gets harshEvents table data for currently selected machines
             */
            gethHarshEventsTable: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/harsh-events/?token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&granularity=' + granularity + '&eventsDetails=true',
                    harshEventsTable;

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
                //    q.resolve(harshEventsTable);
                //
                //}, 500);

                return q.promise;
            },
            /**
             * @function gethHarshEventsDataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/harshEvents.HarshEventsService
             * @description gets harshEvents table data for currently selected machines
             */
            getHarshEventsDataAverage: function(granularity){

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/harsh-events/average' + '?granularity=' + granularity + '&token=' + token + '&startDate=' + startDate + '&endDate=' + endDate + '&eventsDetails=true',
                    harshEventDataAverage;

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
                //    q.resolve(harshEventDayAverage);
                //
                //}, 500);

                return q.promise;
            }
        };
    }]);
})();