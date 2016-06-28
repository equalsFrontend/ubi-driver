/*jshint -W099*/
/**
 * iMetric
 * @module presentation/mileage/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var mileageController = angular.module('UBIDriver.modules.dashboard.presentations.mileage.controllers', [])

    .controller("MileageController", ["$scope", "$rootScope", "$state", "MileageService", "GraphConfigService", function($scope, $rootScope, $state, MileageService, GraphConfigService){

        $scope.getMileageData = function(granularity){
            MileageService.getMileageData(granularity).then(function(data){
                //console.log("try to set scope");

                //console.log(data);

                $scope.setMileageData(data, granularity);
                $scope.setMileageDataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        $scope.getMileageDataAverage = function(granularity){
            MileageService.getMileageDataAverage(granularity).then(function(data){
                $scope.setMileageDataAverage(data, granularity);
                $scope.setMileageDataAverageChartConfig(data, 2);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

       $scope.setMileageData = function(mileage, granularity){
            $scope.mileageData = mileage;
            $scope.mileageDataGranularity = granularity;
        };

        $scope.setMileageDataChartConfig = function(mileage){
            var category   = new Array(),
                data       = new Array(),
                max_y      = 0,
                min_y      = 999999999,
                eventCount = 0,
                view_port  = $(window).width();

            for (var i in mileage.mileage) {

                category.push(i);

                var point = {
                    grade:mileage.mileage[i].grade,
                    y:mileage.mileage[i].mileage,
                    original:mileage.summary.grade,
                    cible:'km_note2'
                };

                data.push(point);

                if (max_y < mileage.mileage[i].mileage) max_y =  mileage.mileage[i].mileage;
                if (min_y > mileage.mileage[i].mileage) min_y =  mileage.mileage[i].mileage;

                eventCount++;
            }

            var series = [{
                name: $rootScope.LANG.KILOMETERS,
                type: 'areaspline',
                data: data,
                color: '#b9b9b9'
            }];

            var min_x = eventCount - 31,
                max_x = eventCount - 1;

            if(view_port < 750){
                min_x = eventCount - 7;
                max_x = eventCount - 1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.mileageDataConfig = GraphConfigService.areaChartConfig(series, category, min_x, max_x);
        }

        $scope.setMileageDataAverage = function(mileageAverage, granularity){
            $scope.mileageAverage = mileageAverage;
            $scope.mileageAverageGranularity = granularity;
        }

        $scope.setMileageDataAverageChartConfig = function(mileageAverage){

            var max_y = 0,
                min_y = 999999999,
                category = $rootScope.LANG.JOUR;

            for (var i = 0; i< mileageAverage.selectedTimeFramePerPeriod.length; i++) {
                if (max_y < mileageAverage.selectedTimeFramePerPeriod[i]) max_y = mileageAverage.selectedTimeFramePerPeriod[i];
                if (min_y > mileageAverage.selectedTimeFramePerPeriod[i]) min_y = mileageAverage.selectedTimeFramePerPeriod[i];
            }

            for (var i=0;i < mileageAverage.sinceBeginningPerPeriod.length; i++) {
                if (max_y < mileageAverage.sinceBeginningPerPeriod[i]) max_y = mileageAverage.sinceBeginningPerPeriod[i];
                if (min_y > mileageAverage.sinceBeginningPerPeriod[i]) min_y = mileageAverage.sinceBeginningPerPeriod[i];
            }

            var series = [{
                name: $rootScope.LANG.AVERAGE_PERIOD,
                type: 'spline',
                data: mileageAverage.selectedTimeFramePerPeriod,
                color:'#42A5F5',
                dashStyle: 'longdash'
            }, {
                name: $rootScope.LANG.AVERAGE_SIGN_IN,
                type: 'spline',
                data: mileageAverage.sinceBeginningPerPeriod,
                color:'#42A5F5',
                dashStyle: 'shortdot'
            }];

            $scope.mileageAverageConfig = GraphConfigService.splineChartConfig(series, category, min_y, max_y);
        }


        if(!$rootScope.noDevice && !$rootScope.noData) {
            $scope.getMileageData('DAY');
            $scope.getMileageDataAverage('DAY');
        }
    }]);
})();