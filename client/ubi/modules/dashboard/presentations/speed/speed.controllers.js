/*jshint -W099*/
/**
 * iMetric
 * @module presentation/speed/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var speedContoller = angular.module('UBIDriver.modules.dashboard.presentations.speed.controllers', [])

    .controller("SpeedController", ["$scope", "$rootScope", "$state", "SpeedService", "GraphConfigService", function($scope, $rootScope, $state, SpeedService, GraphConfigService){

        $scope.getSpeedData = function(granularity){
            SpeedService.getSpeedData(granularity).then(function(data){
                $scope.setSpeedData(data, granularity);
                $scope.setSpeedDataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.getSpeedDataAverage = function(granularity){
            SpeedService.getSpeedDataAverage(granularity).then(function(data){
                $scope.setSpeedDataAverage(data, granularity);
                $scope.setSpeedDataAverageChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.setSpeedData = function(speed, granularity){
            $scope.speedData = speed;
            $scope.speedDataGranularity = granularity;
        }

        $scope.setSpeedDataChartConfig = function(speed){
            var category = new Array();
            var series =[{
                type: 'areaspline',
                yAxis: 0,
                name: $rootScope.LANG.AVERAGE_SPEED,
                data: [],
                color:'#42A5F5'
            },{
                name: $rootScope.LANG.KILOMETERS,
                type: 'spline',
                yAxis: 1,
                data: [],
                color:'#b9b9b9'
            }];

            var max_y1 = 0;
            var min_y1 = 0;
            var max_y2 = 0;
            var min_y2 = 0;
            var c=0;

            for (var i in speed.periods) {
                category.push(i);
                var point1 = {
                    grade:speed.periods[i].grade,
                    y:speed.periods[i].speed,
                    original:speed.summary.grade,
                    cible:'vitesse_note2'
                };
                var point2 = {
                    grade:speed.periods[i].grade,
                    y:speed.periods[i].mileage,
                    original:speed.summary.grade,
                    cible:'vitesse_note2'
                };
                series[0].data.push(point1);
                series[1].data.push(point2);

                if (max_y1<speed.periods[i].speed) max_y1 = speed.periods[i].speed;
                if (min_y1>speed.periods[i].speed) min_y1 = speed.periods[i].speed;
                if (max_y2<speed.periods[i].mileage) max_y2 = speed.periods[i].mileage;
                if (min_y1>speed.periods[i].mileage) min_y2 = speed.periods[i].mileage;
                c++;
            }

            var view_port = $(window).width();
            var enabled = true;

            var min_x = c-31;
            var max_x = c-1;

            if(view_port < 750){
                min_x = c-7;
                max_x = c-1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.speedDataConfig = GraphConfigService.areaSplineChartConfig(series, category, min_x, max_x);
        }

        $scope.setSpeedDataAverage = function(speedAverage, granularity){
            $scope.speedDataAverage = speedAverage;
            $scope.speedDataAverageGranularity = granularity;
        }

        $scope.setSpeedDataAverageChartConfig = function(speedAverage){

            var category = $rootScope.LANG.JOUR;
            var elem = angular.copy(category).shift();



            var series =[{
                name: $rootScope.LANG.AVERAGE_PERIOD,
                type: 'spline',
                data: speedAverage.selectedTimeFramePerPeriod,
                color:'#42A5F5',
                dashStyle: 'longdash'
            }, {
                name: $rootScope.LANG.AVERAGE_SIGN_IN,
                type: 'spline',
                data: speedAverage.sinceBeginningPerPeriod,
                color:'#42A5F5',
                dashStyle: 'shortdot'
            }];

            var c = 0;

            //var test_last = series[0].data;
            //series[0].data.push(test_last);

            //var test_last1 = series[1].data;
            //series[1].data.push(test_last1);

            var max_y1 = 0;
            var min_y1 = 999999999;

            for (var i = 0;i < speedAverage.selectedTimeFramePerPeriod.length;i++) {
                if (max_y1 < speedAverage.selectedTimeFramePerPeriod[i]) max_y1 = speedAverage.selectedTimeFramePerPeriod[i];
                if (min_y1 > speedAverage.selectedTimeFramePerPeriod[i]) min_y1 = speedAverage.selectedTimeFramePerPeriod[i];
            }

            for (var i = 0;i < speedAverage.sinceBeginningPerPeriod.length;i++) {
                if (max_y1 < speedAverage.sinceBeginningPerPeriod[i]) max_y1 = speedAverage.sinceBeginningPerPeriod[i];
                if (min_y1 > speedAverage.sinceBeginningPerPeriod[i]) min_y1 = speedAverage.sinceBeginningPerPeriod[i];
            }

            var view_port = $(window).width();
            var min_x = c-31;
            var max_x = c-1;

            if(view_port < 750){
                min_x = c - 7;
                max_x = c - 1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            var axis = {
                y: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} km/h',
                        enabled: true
                    },
                    min: min_y1 - 2,
                    max:  max_y1 + 2
                }],
                x: {
                    categories: category,
                    tickWidth: 0,
                    labels: {
                        enabled: true,
                        style: {
                            color: '#87878A',
                            fontWeight:'regular',
                            fontSize:'11px'
                        }
                    }
                }
            };

            $scope.speedAverageConfig = GraphConfigService.splineChartConfig(series, category, min_y1 - 2, max_y1 + 2, axis);

            return $scope.speedAverageConfig;
        };


        if(!$rootScope.noDevice && !$rootScope.noData) {
            $scope.getSpeedData('DAY');
            $scope.getSpeedDataAverage('DAY');
        }
    }]);
})();