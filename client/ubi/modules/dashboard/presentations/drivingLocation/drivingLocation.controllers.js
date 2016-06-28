/*jshint -W099*/
/**
 * iMetric
 * @module presentation/drivingLocation/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var typeRoadcntroller = angular.module('UBIDriver.modules.dashboard.presentations.drivingLocation.controllers', [])

    .controller("DrivingLocationController", ["$scope", "$rootScope", "$state", "DrivingLocationService", "GraphConfigService", function($scope, $rootScope, $state, DrivingLocationService, GraphConfigService){

        $scope.getDrivingLocationData = function(granularity){
            DrivingLocationService.getDrivingLocationData(granularity).then(function(data){
                $scope.setDrivingLocationData(data, granularity);
                $scope.setDrivingLocationDataChartConfig(data);

                //console.log(data);
                //console.log(granularity);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.getDrivingLocationDataAverage = function(granularity){
            DrivingLocationService.getDrivingLocationDataAverage(granularity).then(function(data){
                $scope.setDrivingLocationDataAverage(data, granularity);
                $scope.setDrivingLocationDataAverageChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.setDrivingLocationData = function(drivingLocation, granularity){
            $scope.drivingLocationData = drivingLocation;
            $scope.drivingLocationDataGranularity = granularity;
        };

        $scope.setDrivingLocationDataChartConfig = function(drivingLocation){
            var category = new Array();

            var series =[{
                name: $rootScope.LANG.URBAN,
                data: [],
                color: '#42A5F5'
            }, {
                name: $rootScope.LANG.RURAL,
                data: [],
                color: '#2962FF'
            }];

            var c=0;

            for (var i in drivingLocation.periods) {

                category.push(i);

                var point1 = {
                    grade: drivingLocation.periods[i].grade,
                    y: Math.round(drivingLocation.periods[i].usage["URBAN"]),
                    original: drivingLocation.drivingLocationSummary.grade,
                    cible:'zone_note'
                };

                var point2 = {
                    grade: drivingLocation.periods[i].grade,
                    y: Math.round(drivingLocation.periods[i].usage["RURAL"]),
                    original: drivingLocation.drivingLocationSummary.grade,
                    cible:'zone_note'
                };

                series[0].data.push(point1);
                series[1].data.push(point2);
                c++;

            }

            var view_port = $(window).width();
            var min_x = c-19;
            var max_x = c-1;

            if(view_port < 750){
                min_x = c-7;
                max_x = c-1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.drivingLocationChartConfig = GraphConfigService.stackingChartConfig(series, category, min_x, max_x);
        }

        $scope.setDrivingLocationDataAverage = function(drivingLocationAverage, granularity){
            $scope.drivingLocationDataAverage = drivingLocationAverage;
            $scope.drivingLocationDataAverageGranularity = granularity;
        }

        $scope.setDrivingLocationDataAverageChartConfig = function(drivingLocationAverage){

            var series = [{
                name: $rootScope.LANG.URBAN,
                y: Math.round(drivingLocationAverage.sinceBeginning.URBAN * 10) / 10,
                sliced: true,
                selected: true,
                color: '#42A5F5'
            },{
                name: $rootScope.LANG.RURAL,
                y: Math.round(drivingLocationAverage.sinceBeginning.RURAL * 10) / 10,
                sliced: false,
                selected: false,
                color: '#2962FF'
            }];

            var series2 = [{
                name: $rootScope.LANG.URBAN,
                y: Math.round(drivingLocationAverage.selectedTimeFrame.URBAN * 10) / 10,
                sliced: true,
                selected: true,
                color: '#42A5F5'
            },{
                name: $rootScope.LANG.RURAL,
                y: Math.round(drivingLocationAverage.selectedTimeFrame.RURAL * 10) / 10,
                sliced: false,
                selected: false,
                color: '#2962FF'
            }];

            $scope.drivingLocationAverage1Config = GraphConfigService.pieChartConfig(series);
            $scope.drivingLocationAverage2Config = GraphConfigService.pieChartConfig(series2);

        }


        if(!$rootScope.noDevice && !$rootScope.noData) {
            $scope.getDrivingLocationData("DAY");
            $scope.getDrivingLocationDataAverage("DAY");
        }
    }]);
})();