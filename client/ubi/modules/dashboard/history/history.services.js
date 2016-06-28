/*jshint -W099*/

/**
 * iMetric
 * @module module/history/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var historyServices = angular.module('UBIDriver.modules.history.services', [])

        .factory('HistoryService', ['$q', '$rootScope', '$http', 'DashboardService', 'UserAuthService', 'PATHS', function($q, $rootScope, $http, DashboardService, UserAuthService, PATHS){
            return {
                getHistoryData: function(startDate, endDate){

                    var q          = $q.defer(),
                        self       = this,
                        machine    = DashboardService.currentMachine,
                        url        = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/drivingAdvices?startDate=' + startDate + '&endDate=' + endDate + '&granularity=WEEK&token=' + UserAuthService.getToken();

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