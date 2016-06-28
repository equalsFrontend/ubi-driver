/*jshint -W099*/
/**
 * iMetric
 * @module presentation/timeUse/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var timeUseController = angular.module('UBIDriver.modules.dashboard.presentations.timeUse.controllers', [])

    .controller("TimeUseController", ["$scope", "$rootScope", "$state", "TimeUseService", "GraphConfigService", function($scope, $rootScope, $state, TimeUseService, GraphConfigService){

        $scope.getTimeUseData = function(granularity){
            TimeUseService.getTimeUseData(granularity).then(function(data){
                $scope.setTimeUseData(data, granularity);
                $scope.setTimeUseDataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.getTimeUseDataAverage = function(granularity){
            TimeUseService.getTimeUseDataAverage(granularity).then(function(data){
                $scope.setTimeUseAverage(data, granularity);
                $scope.setTimeUseAverageChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.setTimeUseData = function(timeUse, granularity){
            $scope.timeUseData = timeUse;
            $scope.timeUseDataGranularity = granularity;
        }

        $scope.setTimeUseDataChartConfig = function(timeUse){
            var category = new Array(),
                series =[{
                    name: $rootScope.LANG.MORNING,
                    data: [],
                    color: '#42A5F5'
                }, {
                    name: $rootScope.LANG.AFTERNOON,
                    data: [],color: '#2962FF'
                }, {
                    name: $rootScope.LANG.EVENING + '<span></span>',
                    data: [],
                    color: '#00BCD4'
                }, {
                    name: $rootScope.LANG.NIGHT,
                    data: [],
                    color: '#7C4DFF'
                }];

            var c = 0;

            for (var i in timeUse.periods) {

                var point1 = {
                    grade: timeUse.periods[i].grade,
                    y: Math.round(timeUse.periods[i].usage["MORNING"]),
                    original: timeUse.summary.grade,
                    cible:'timeuse_note2'
                };
                var point2 = {
                    grade: timeUse.periods[i].grade,
                    y: Math.round(timeUse.periods[i].usage["AFTERNOON"]),
                    original: timeUse.summary.grade,
                    cible:'timeuse_note2'
                };
                var point3 = {
                    grade: timeUse.periods[i].grade,
                    y: Math.round(timeUse.periods[i].usage["EVENING"]),
                    original: timeUse.summary.grade,
                    cible:'timeuse_note2'
                };
                var point4 = {
                    grade: timeUse.periods[i].grade,
                    y: Math.round(timeUse.periods[i].usage["NIGHT"]),
                    original: timeUse.summary.grade,
                    cible:'timeuse_note2'};

                category.push(i);

                series[0].data.push(point1);
                series[1].data.push(point2);
                series[2].data.push(point3);
                series[3].data.push(point4);

                c++;
            }

            var view_port = $(window).width(),
                min_x = c-19,
                max_x = c-1;

            if(view_port < 750){
                min_x = c-7;
                max_x = c-1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.timeUseChartConfig = GraphConfigService.stackingChartConfig(series, category, min_x, max_x);
        }

        $scope.setTimeUseAverage = function(timeUseAverage, granularity) {
            $scope.timeUseAverage = timeUseAverage;
            $scope.timeUseAverageGranularity = granularity;
        }

        $scope.setTimeUseAverageChartConfig = function(timeUseAverage){
            var series = [{
                name: $rootScope.LANG.MORNING,
                y: Math.round(timeUseAverage.sinceBeginning.MORNING * 10) / 10,
                sliced: true,
                selected: true,
                color: '#42A5F5'
            },{
                name: $rootScope.LANG.AFTERNOON,
                y: Math.round(timeUseAverage.sinceBeginning.AFTERNOON * 10) / 10,
                sliced: false,
                selected: false,
                color: '#2962FF'
            },{
                name: $rootScope.LANG.EVENING + '<span></span>',
                y: Math.round(timeUseAverage.sinceBeginning.EVENING * 10) / 10,
                sliced: false,
                selected: false,
                color: '#00BCD4'
            },{
                name: $rootScope.LANG.NIGHT,
                y: Math.round(timeUseAverage.sinceBeginning.NIGHT * 10) / 10,
                sliced: false,
                selected: false,
                color: '#7C4DFF'
            }];

            var series2 = [{
                name: $rootScope.LANG.MORNING,
                y: Math.round(timeUseAverage.selectedTimeFrame.MORNING * 10) / 10,
                sliced: true,
                selected: true,
                color: '#42A5F5'
            },{
                name: $rootScope.LANG.AFTERNOON,
                y: Math.round(timeUseAverage.selectedTimeFrame.AFTERNOON * 10) / 10,
                sliced: false,
                selected: false,
                color: '#2962FF'
            },{
                name: $rootScope.LANG.EVENING + '<span></span>',
                y: Math.round(timeUseAverage.selectedTimeFrame.EVENING * 10) / 10,
                sliced: false,
                selected: false,
                color: '#00BCD4'
            },{
                name: $rootScope.LANG.NIGHT,
                y: Math.round(timeUseAverage.selectedTimeFrame.NIGHT * 10) / 10,
                sliced: false,
                selected: false,
                color: '#7C4DFF'
            }];

            $scope.timeUseAverage1Config = GraphConfigService.pieChartConfig(series);

            $scope.timeUseAverage2Config = GraphConfigService.pieChartConfig(series2);
        }

        if(!$rootScope.noDevice && !$rootScope.noData){
            $scope.getTimeUseData('DAY');
            $scope.getTimeUseDataAverage('DAY');
        }
    }]);
})();