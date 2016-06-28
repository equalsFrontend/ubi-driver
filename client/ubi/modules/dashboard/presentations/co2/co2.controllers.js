/*jshint -W099*/
/**
 * iMetric
 * @module presentation/co2/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2ontroller = angular.module('UBIDriver.modules.dashboard.presentations.co2.controllers', [])

    .controller("Co2Controller", ["$scope", "$rootScope", "$state", "Co2Service", "GraphConfigService", function($scope, $rootScope, $state, Co2Service, GraphConfigService){

        $scope.getCo2Data = function(granularity){
            Co2Service.getCo2Data(granularity).then(function(data){
                setCo2Data(data, granularity);
                setCo2DataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.getCo2DataAverage = function(granularity){
            Co2Service.getCo2DataAverage(granularity).then(function(data){
                setCo2DataAverage(data, granularity);
                setCo2DataAverageChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        function setCo2Data(co2, granularity){
            $scope.co2Data = co2;
            $scope.co2DataGranularity = granularity;
        }

        function setCo2DataChartConfig(co2){
            var category = new Array();
            var series =[{
                type: 'areaspline',
                yAxis: 0,
                name: $rootScope.LANG.CO2_EMISSIONS,
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

            for (var i in co2.periods) {
                category.push(i);
                //var point1 = {
                //    grade:co2.periods[i].grade,
                //    y: co2.periods[i].ratio,
                //    original:co2.summary.grade,
                //    cible:'co2_note2'
                //};
                //var point2 = {
                //    grade:co2.periods[i].amountPerKM,
                //    y:co2.periods[i].mileage,
                //    original:co2.summary.amountPerKM,
                //    cible:'co2_ratio1'
                //};

                var point1 = {
                    grade:co2.periods[i].grade,
                    y:co2.periods[i].ratio,
                    original:co2.summary.grade,
                    cible:'co2_note2',
                    grade2: co2.periods[i].ratio,
                    original2: co2.periods[i].ratio,
                    cible2: 'co2_ratio1'
                };

                var point2 = {
                    grade:co2.periods[i].grade,
                    y:co2.periods[i].mileage,
                    original:co2.summary.grade,
                    cible:'co2_note2',
                    grade2: co2.periods[i].ratio,
                    original2: co2.periods[i].ratio,
                    cible2: 'co2_ratio1'
                };

                series[0].data.push(point1);
                series[1].data.push(point2);

                if (max_y1<co2.periods[i].co2) max_y1 = co2.periods[i].co2;
                if (min_y1>co2.periods[i].co2) min_y1 = co2.periods[i].co2;
                if (max_y2<co2.periods[i].mileage) max_y2 = co2.periods[i].mileage;
                if (min_y1>co2.periods[i].mileage) min_y2 = co2.periods[i].mileage;
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

            var axis = {
                y: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} g/km',
                        enabled: true
                    }
                }, {
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Km',
                        enabled: true
                    },
                    opposite: true
                }]
            };

            $scope.co2DataConfig = GraphConfigService.areaSplineChartConfig(series, category, min_x, max_x, axis);
        }

        function setCo2DataAverage(co2Average, granularity){
            $scope.co2DataAverage = co2Average;
            $scope.co2DataAverageGranularity = granularity;
        }

        function setCo2DataAverageChartConfig(co2Average){
            var category = $rootScope.LANG.JOUR;

            var series =[{
                name: $rootScope.LANG.AVERAGE_PERIOD,
                type: 'spline',
                data: co2Average.selectedTimeFramePerPeriod,
                color:'#42A5F5',
                dashStyle: 'longdash'
            }, {
                name: $rootScope.LANG.AVERAGE_SIGN_IN,
                type: 'spline',
                data: co2Average.sinceBeginningPerPeriod,
                color:'#42A5F5',
                dashStyle: 'shortdot'
            }];

            var c = 0;

            var max_y1 = 0;
            var min_y1 = 999999999;

            for (var i = 0;i < co2Average.selectedTimeFramePerPeriod.length;i++) {
                if (max_y1 < co2Average.selectedTimeFramePerPeriod[i]) max_y1 = co2Average.selectedTimeFramePerPeriod[i];
                if (min_y1 > co2Average.selectedTimeFramePerPeriod[i]) min_y1 = co2Average.selectedTimeFramePerPeriod[i];
            }

            for (var i = 0;i < co2Average.sinceBeginningPerPeriod.length;i++) {
                if (max_y1 < co2Average.sinceBeginningPerPeriod[i]) max_y1 = co2Average.sinceBeginningPerPeriod[i];
                if (min_y1 > co2Average.sinceBeginningPerPeriod[i]) min_y1 = co2Average.sinceBeginningPerPeriod[i];
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
                        format: '{value} g/km',
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

            $scope.co2AverageConfig = GraphConfigService.splineChartConfig(series, category, min_y1 - 2, max_y1 + 2, axis);
        }


        if(!$rootScope.noDevice && !$rootScope.noData) {
            $scope.getCo2Data('DAY');
            $scope.getCo2DataAverage('DAY');
        }
    }]);
})();