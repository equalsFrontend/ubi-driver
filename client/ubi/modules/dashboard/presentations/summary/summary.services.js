/*jshint -W099*/

/**
 * iMetric
 * @module presentation/summary/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var dashboardServices = angular.module('UBIDriver.modules.dashboard.presentations.summary.services', [])

    /**
     * @constructor SummaryService
     * @memberOf module:presentation/summary
     */
        .factory('SummaryService', ['$q', '$rootScope', '$timeout', 'DashboardService', '$http', 'PATHS', 'STUB', 'UserAuthService', function($q, $rootScope, $timeout, DashboardService, $http, PATHS, STUB, UserAuthService){
            return {

                /**
                 * @function getSummaryData
                 * @author Alex Boisselle
                 * @memberOf module:presentation/summary.SummaryService
                 * @description gets summary data for currently selected machines
                 */
                getSummaryData: function() {

                    var q              = $q.defer(),
                        self           = this,
                        machine        = DashboardService.currentMachine,
                        endDate        = $rootScope.endDate.full,
                        token          = UserAuthService.getToken(),
                        url            = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/summary/' + endDate + '?token=' + token,
                        summary;

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
                        self.data = data;

                        q.resolve(data);
                    })
                    .error(function(data, status, headers, config){
                        q.reject(status);
                    });

                    return q.promise;
                },

                getCalendarDate: function(){

                    var q              = $q.defer(),
                        self           = this,
                        machine        = DashboardService.currentMachine.machine,
                        startDate      = machine.firstConnectionDateTime.split(' ')[0],
                        year           = startDate.split('-')[0],
                        month          = startDate.split('-')[1],
                        token          = UserAuthService.getToken(),
                        url            = PATHS.API + '/metrics/machines/' + machine.identifier + '/activity/' + year + '/' + month + '?token=' + token;

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