/*jshint -W099*/

/**
 * iMetric
 * @module presentation/mileage/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var mileageServices = angular.module('UBIDriver.modules.dashboard.presentations.mileage.services', [])

    /**
     * @constructor MileageService
     * @memberOf module:presentation/mileage
     */
    .factory('MileageService', ['$q', '$rootScope', '$timeout', '$http', 'DashboardService', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, $http, DashboardService, PATHS, STUB, UserAuthService){
        return {

            /**
             * @function getMileageData
             * @author Alex Boisselle
             * @memberOf module:presentation/mileage.MileageService
             * @description gets mileage data for currently selected machines
             */
            getMileageData: function(granularity) {

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/mileage' + '?granularity=' + granularity + '&startDate=' + startDate + '&endDate=' + endDate + '&token=' + token,
                    mileage;

                //mileage = STUB.MILEAGE;

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
                //    q.resolve(mileage);
                //
                //}, 500);

                return q.promise;
            },
            /**
             * @function getMileageDataAverage
             * @author Alex Boisselle
             * @memberOf module:presentation/mileage.MileageService
             * @description gets mileage data for currently selected machines
             */
            getMileageDataAverage: function(granularity) {

                var q              = $q.defer(),
                    self           = this,
                    machine        = DashboardService.currentMachine,
                    startDate      = $rootScope.startDate.full,
                    endDate        = $rootScope.endDate.full,
                    token          = UserAuthService.getToken(),
                    url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/mileage/average' + '?granularity=' + granularity + '&startDate=' + startDate + '&endDate=' + endDate + '&token=' + token,
                    mileageAverage;

                //mileageAverage = STUB.MILEAGE_AVERAGE;

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
                //    q.resolve(mileageAverage);
                //
                //}, 500);

                return q.promise;
            }
        };
    }]);
})();