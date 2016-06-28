/*jshint -W099*/
/**
 * iMetric
 * @module presentation/typeRoad/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var typeRoadcntroller = angular.module('UBIDriver.modules.dashboard.presentations.typeRoad.controllers', [])

    .controller("TypeRoadController", ["$scope", "$rootScope", "$state", "TypeRoadService", "GraphConfigService", function($scope, $rootScope, $state, TypeRoadService, GraphConfigService){

        $scope.getTypeRoadData = function(granularity){
            TypeRoadService.getTypeRoadData(granularity).then(function(data){
                $scope.setTypeRoadData(data, granularity);
                $scope.setTypeRoadDataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.getTypeRoadDataAverage = function(granularity){
            TypeRoadService.getTypeRoadDataAverage(granularity).then(function(data){
                $scope.setTypeRoadAverage(data, granularity);
                $scope.setTypeRoadAverageChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.setTypeRoadData = function(typeRoad, granularity){
            $scope.typeRoadData = typeRoad;
            $scope.typeRoadDataGranularity = granularity;
        }

        $scope.setTypeRoadDataChartConfig = function(typeRoad){
            var view_port = $(window).width(),
                category = new Array(),
                series =[{
                    name: $rootScope.LANG.HIGHWAY + '<span></span>',
                    data: [],
                    color: '#42A5F5'
                }, {
                    name: $rootScope.LANG.TRUNK_ROADS,
                    data: [],
                    color: '#2962FF'
                }, {
                    name: $rootScope.LANG.COUNTRY_ROADS,
                    data: [],
                    color: '#00BCD4'
                }, {
                    name: $rootScope.LANG.CITY_STREETS,
                    data: [],
                    color: '#7C4DFF'
                }, {
                    name: $rootScope.LANG.RESIDENTIAL_STREETS_AND_OTHER,
                    data: [],
                    color: '#9C27B0'
                }];

            var c=0;

            for (var i in typeRoad.periods) {

                var point1 = {
                    grade: typeRoad.periods[i].grade + 1,
                    y: Math.round(typeRoad.periods[i].usage["HIGHWAY"]),
                    original: typeRoad.summary.grade + 1,
                    cible:'typeroute_note2'
                };
                var point2 = {
                    grade: typeRoad.periods[i].grade + 1,
                    y: Math.round(typeRoad.periods[i].usage["TRUNK_ROADS"]),
                    original: typeRoad.summary.grade + 1,
                    cible:'typeroute_note2'
                };
                var point3 = {
                    grade: typeRoad.periods[i].grade + 1,
                    y: Math.round(typeRoad.periods[i].usage["COUNTRY_ROADS"]),
                    original: typeRoad.summary.grade + 1,
                    cible:'typeroute_note2'
                };
                var point4 = {
                    grade: typeRoad.periods[i].grade + 1,
                    y: Math.round(typeRoad.periods[i].usage["CITY_STREETS"]),
                    original: typeRoad.summary.grade + 1,
                    cible:'typeroute_note2'
                };
                var point5 = {
                    grade: typeRoad.periods[i].grade + 1,
                    y: Math.round(typeRoad.periods[i].usage["RESIDENTIAL_STREETS_AND_OTHER"]),
                    original: typeRoad.summary.grade + 1,
                    cible: 'typeroute_note2'
                };

                category.push(i);

                series[0].data.push(point1);
                series[1].data.push(point2);
                series[2].data.push(point3);
                series[3].data.push(point4);
                series[4].data.push(point5);

                c++;
            }

            var min_x = c-19,
                max_x = c-1;

            if(view_port < 750){
                min_x = c-7;
                max_x = c-1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.typeRoadChartConfig = GraphConfigService.stackingChartConfig(series, category, min_x, max_x);
        }

        $scope.setTypeRoadAverage = function(typeRoadAverage, granularity){
            $scope.typeRoadAverage = typeRoadAverage;
            $scope.typeRoadAverageGranularity = granularity;
        }

        $scope.setTypeRoadAverageChartConfig = function(typeRoadAverage){
            var view_port = $(window).width();

            var series = [{
                name: $rootScope.LANG.HIGHWAY,
                y: Math.round(typeRoadAverage.sinceBeginning.HIGHWAY * 10) / 10,
                sliced: true,
                selected: true,
                color: '#42A5F5'
            },{
                name: $rootScope.LANG.TRUNK_ROADS,
                y: Math.round(typeRoadAverage.sinceBeginning.TRUNK_ROADS * 10) / 10,
                sliced: false,
                selected: false,
                color: '#2962FF'
            },{
                name: $rootScope.LANG.COUNTRY_ROADS + '<span></span>',
                y: Math.round(typeRoadAverage.sinceBeginning.COUNTRY_ROADS * 10) / 10,
                sliced: false,
                selected: false,
                color: '#00BCD4'
            },{
                name: $rootScope.LANG.CITY_STREETS,
                y: Math.round(typeRoadAverage.sinceBeginning.CITY_STREETS * 10) / 10,
                sliced: false,
                selected: false,
                color: '#7C4DFF'
            },{
                name: $rootScope.LANG.RESIDENTIAL_STREETS_AND_OTHER,
                y: Math.round(typeRoadAverage.sinceBeginning.RESIDENTIAL_STREETS_AND_OTHER * 10) / 10,
                sliced: false,
                selected: false,
                color: '#9C27B0'
            }];

            var series2 = [{
                name: $rootScope.LANG.HIGHWAY,
                y: Math.round(typeRoadAverage.selectedTimeFrame.HIGHWAY * 10) / 10,
                sliced: true,
                selected: true,
                color: '#42A5F5'
            },{
                name: $rootScope.LANG.TRUNK_ROADS,
                y: Math.round(typeRoadAverage.selectedTimeFrame.TRUNK_ROADS * 10) / 10,
                sliced: false,
                selected: false,
                color: '#2962FF'
            },{
                name: $rootScope.LANG.COUNTRY_ROADS + '<span></span>',
                y: Math.round(typeRoadAverage.selectedTimeFrame.COUNTRY_ROADS * 10) / 10,
                sliced: false,
                selected: false,
                color: '#00BCD4'
            },{
                name: $rootScope.LANG.CITY_STREETS,
                y: Math.round(typeRoadAverage.selectedTimeFrame.CITY_STREETS * 10) / 10,
                sliced: false,
                selected: false,
                color: '#7C4DFF'
            },{
                name: $rootScope.LANG.RESIDENTIAL_STREETS_AND_OTHER,
                y: Math.round(typeRoadAverage.selectedTimeFrame.RESIDENTIAL_STREETS_AND_OTHER * 10) / 10,
                sliced: false,
                selected: false,
                color: '#9C27B0'
            }];

            $scope.typeRoadAverage1Config = GraphConfigService.pieChartConfig(series);

            $scope.typeRoadAverage2Config = GraphConfigService.pieChartConfig(series2);
        }


        if(!$rootScope.noDevice && !$rootScope.noData) {
            $scope.getTypeRoadData('DAY');
            $scope.getTypeRoadDataAverage('DAY');
        }
    }]);
})();