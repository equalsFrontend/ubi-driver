/*jshint -W099*/
/**
 * iMetric
 * @module presentation/harshEvents/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var co2ontroller = angular.module('UBIDriver.modules.dashboard.presentations.harshEvents.controllers', [])

    .controller("HarshEventsController", ["$scope",
                                          "$rootScope",
                                          "$state",
                                          "$timeout",
                                          "HarshEventsService",
                                          "GraphConfigService",
                                          "BingService",
                                          function($scope,
                                                   $rootScope,
                                                   $state,
                                                   $timeout,
                                                   HarshEventsService,
                                                   GraphConfigService,
                                                   BingService){

        $scope.harshBrakingCount = 0;
        $scope.harshBrakingData = null;
        $scope.harshBrakingDataGranularity = null;
        $scope.harshBrakingAverage = null;
        $scope.harshBrakingAverageGranularity = null;

        $scope.harshAccelerationCount = 0;
        $scope.harshAccelerationData = null;
        $scope.harshAccelerationDataGranularity = null;
        $scope.harshAccelerationAverage = null;
        $scope.harshAccelerationAverageGranularity = null;

        $scope.harshEventsTableData = [];
        $scope.harshEventsMapData = [];
        $scope.harshEventTablePage = 0;
        $scope.harshEventsTableItemsPerPage = 10;

        $scope.allHarshEvents = [];
        $scope.accelEvents = [];
        $scope.brakeEvents = [];

        $scope.getHarshEventsData = function(granularity){
            HarshEventsService.getHarshEventsData(granularity).then(function(data){

                setHarshBrakingData(data, granularity);
                setHarshBrakingDataChartConfig(data);

                setHarshAccelData(data, granularity);
                setHarshAccelDataChartConfig(data);

                HarshEventsService.gethHarshEventsTable(granularity).then(function(tableData){

                    setHarshEventsData(tableData);

                    $rootScope.$broadcast('scopeUpdated');
                });
            });
        };

        $scope.getHarshEventsDataAverage = function(granularity){
            HarshEventsService.getHarshEventsDataAverage(granularity).then(function(data){

                setHarshBrakingDataAverage(data, granularity);
                setHarshBrakingDataAverageChartConfig(data);

                setHarshAccelDataAverage(data, granularity);
                setHarshAccelDataAverageChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        function setHarshEventsData(data){
            //make new array of events

            var page = $scope.harshEventTablePage,
                start = page * 20 - (20 - 1),
                end = page * 20,
                events = [];

            for(var d in data.events){
                var day = data.events[d];

                for(var a in day.acceleration){
                    var accelEvent = day.acceleration[a];

                    accelEvent.type = "acceleration";
                    accelEvent.name = "acc_" + d + "_" + a;
                    accelEvent.info = {
                        date : d,
                        title: "<span style='color:#ef742a;'>" + $rootScope.LANG.ACCELERATION + "</span>",
                        stats: {
                            duration: accelEvent.duration,
                            initialSpeed: accelEvent.initialSpeed,
                            intensity: accelEvent.intensity
                        }
                    };

                    $scope.accelEvents.push(accelEvent);
                    $scope.allHarshEvents.push(accelEvent);
                }

                for(var a in day.braking){
                    var brakingEvent = day.braking[a];

                    brakingEvent.type = "braking";
                    brakingEvent.name = "bra_" + d + "_" + a;
                    brakingEvent.info = {
                        date : d,
                        title: "<span style='color:#e7361f;'>" + $rootScope.LANG.BRAKING + "</span>",
                        stats: {
                            duration: brakingEvent.duration,
                            initialSpeed: brakingEvent.initialSpeed,
                            intensity: brakingEvent.intensity
                        }
                    };

                    $scope.brakeEvents.push(brakingEvent);
                    $scope.allHarshEvents.push(brakingEvent);
                }
            }

            for(var x = start; x <= end; x++){
                events.push($scope.allHarshEvents[x]);
            }

            $scope.allHarshEvents.reverse();

            $scope.mapEvents = angular.copy($scope.allHarshEvents);

            $scope.harshEventsTableData = $scope.allHarshEvents;
        }

        //BRAKING
        $scope.getHarshBrakingEventsData = function(granularity){
            HarshEventsService.getHarshEventsData(granularity).then(function(data){

                setHarshBrakingData(data, granularity);
                setHarshBrakingDataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        function setHarshBrakingData(harshBraking, granularity){
            $scope.harshBrakingData = harshBraking;
            $scope.harshBrakingDataGranularity = granularity;
        }

        function setHarshBrakingDataChartConfig(harshBraking){
            var category = new Array(),
                max_braking = 0,
                min_braking = 99999999,
                max_mileage = 0,
                min_mileage = 9999999,
                series = [{
                    type: 'areaspline',
                    yAxis: 0,
                    name: $rootScope.LANG.EVENT_NUMBER,
                    data: [],
                    color:'#42A5F5'
                },{
                    name: $rootScope.LANG.KILOMETERS,
                    type: 'spline',
                    yAxis: 1,
                    data: [],
                    color:'#b9b9b9'
                }];

            var c=0;

            for (var i in harshBraking.events) {
                category.push(i);

                if (max_braking < harshBraking.events[i].brakingCount) max_braking = harshBraking.events[i].brakingCount;
                if (min_braking > harshBraking.events[i].brakingCount) min_braking = harshBraking.events[i].brakingCount;
                if (max_mileage < harshBraking.events[i].mileage) max_mileage = harshBraking.events[i].mileage;
                if (min_mileage > harshBraking.events[i].mileage) min_mileage = harshBraking.events[i].mileage;

                $scope.harshBrakingCount += harshBraking.events[i].brakingCount;

                var point1 = {
                    grade:harshBraking.events[i].brakingGrade,
                    y:harshBraking.events[i].brakingCount,
                    original:harshBraking.summary.brakingGrade,
                    cible:'note_braking1',
                    grade2: harshBraking.events[i].brakingPer100KM,
                    original2: harshBraking.summary.brakingPer100KM,
                    cible2: 'avg_100k_braking1'
                };

                var point2 = {
                    grade:harshBraking.events[i].brakingGrade,
                    y:harshBraking.events[i].mileage,
                    original:harshBraking.summary.brakingGrade,
                    cible:'note_braking1',
                    grade2: harshBraking.events[i].brakingPer100KM,
                    original2: harshBraking.summary.brakingPer100KM,
                    cible2: 'avg_100k_braking1'
                };

                series[0].data.push(point1);
                series[1].data.push(point2);

                c++;
            }

            var view_port = $(window).width();
            var enabled = true;
            var axis = {
                y: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Evts',
                        enabled: enabled
                    }
                }, {
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Km',
                        enabled: enabled
                    },
                    opposite: true,
                    min: 0
                }]
            }

            var min_x = c-31;
            var max_x = c-1;

            if(view_port < 750){
                min_x = c-7;
                max_x = c-1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.harshBrakingDataConfig = GraphConfigService.areaSplineChartConfig(series, category, min_x, max_x, axis);
        }

        function setHarshBrakingDataAverage(harshBrakingAverage, granularity){
            $scope.harshBrakingAverage = harshBrakingAverage;
            $scope.harshBrakingAverageGranularity = granularity;
        }

        function setHarshBrakingDataAverageChartConfig(harshBraking){
            var category = $rootScope.LANG.JOUR;

            var series =[{
                name: $rootScope.LANG.AVERAGE_PERIOD,
                type: 'spline',
                data: harshBraking.selectedTimeFramePerPeriod.braking,
                color:'#42A5F5',
                dashStyle: 'longdash'
            }, {
                name: $rootScope.LANG.AVERAGE_SIGN_IN,
                type: 'spline',
                data: harshBraking.sinceBeginningPerPeriod.braking,
                color:'#42A5F5',
                dashStyle: 'shortdot'
            }];

            var max_y = 0;
            var min_y = 9999999999;

            for (var i = 0; i < harshBraking.selectedTimeFramePerPeriod.acceleration.length; i++) {
                if (max_y < harshBraking.selectedTimeFramePerPeriod.braking[i]) max_y = harshBraking.selectedTimeFramePerPeriod.braking[i];
                if (min_y > harshBraking.selectedTimeFramePerPeriod.braking[i]) min_y = harshBraking.selectedTimeFramePerPeriod.braking[i];
            }

            for (var i = 0; i < harshBraking.sinceBeginningPerPeriod.acceleration.length; i++) {
                if (max_y < harshBraking.sinceBeginningPerPeriod.braking[i]) max_y = harshBraking.sinceBeginningPerPeriod.braking[i];
                if (min_y > harshBraking.sinceBeginningPerPeriod.braking[i]) min_y = harshBraking.sinceBeginningPerPeriod.braking[i];
            }

            var view_port = $(window).width();
            var enabled = true;

            var axis = {
                y: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Evts',
                        enabled: enabled
                    },
                    min: min_y,
                    max: max_y
                }]
            };

            $scope.harshBrakingDataAverageChartConfig = GraphConfigService.splineChartConfig(series, category, min_y, max_y, axis);

        }

        //ACCEL
        $scope.getHarshAccelEventsData = function(granularity){
            HarshEventsService.getHarshEventsData(granularity).then(function(data){

                setHarshAccelData(data, granularity);
                setHarshAccelDataChartConfig(data);

                $rootScope.$broadcast('scopeUpdated');
            });
        };

        function setHarshAccelData(harshAccel, granularity){
            $scope.harshAccelerationData = harshAccel;
            $scope.harshAccelerationDataGranularity = granularity;
        }

        function setHarshAccelDataChartConfig(harshAccel){
            var category = new Array(),
                max_acceleration = 0,
                min_acceleration = 99999999,
                max_mileage = 0,
                min_mileage = 9999999,
                series = [{
                    type: 'areaspline',
                    yAxis: 0,
                    name: $rootScope.LANG.EVENT_NUMBER,
                    data: [],
                    color:'#42A5F5'
                },{
                    name: $rootScope.LANG.KILOMETERS,
                    type: 'spline',
                    yAxis: 1,
                    data: [],
                    color:'#b9b9b9'
                }];

            var c=0;

            for (var i in harshAccel.events) {
                category.push(i);

                if (max_acceleration < harshAccel.events[i].accelerationCount) max_acceleration = harshAccel.events[i].accelerationCount;
                if (min_acceleration > harshAccel.events[i].accelerationCount) min_acceleration = harshAccel.events[i].accelerationCount;
                if (max_mileage < harshAccel.events[i].mileage) max_mileage = harshAccel.events[i].mileage;
                if (min_mileage > harshAccel.events[i].mileage) min_mileage = harshAccel.events[i].mileage;

                $scope.harshAccelerationCount += harshAccel.events[i].accelerationCount;

                var point1 = {
                    grade:harshAccel.events[i].accelerationGrade,
                    y:harshAccel.events[i].accelerationCount,
                    original:harshAccel.summary.accelerationGrade,
                    cible:'note_acceleration1',
                    grade2: harshAccel.events[i].accelerationPer100KM,
                    original2: harshAccel.summary.accelerationPer100KM,
                    cible2: 'avg_100k_acceleration1'
                };

                var point2 = {
                    grade:harshAccel.events[i].accelerationGrade,
                    y:harshAccel.events[i].mileage,
                    original:harshAccel.summary.accelerationGrade,
                    cible:'note_acceleration1',
                    grade2: harshAccel.events[i].accelerationPer100KM,
                    original2: harshAccel.summary.accelerationPer100KM,
                    cible2: 'avg_100k_acceleration1'
                };

                series[0].data.push(point1);
                series[1].data.push(point2);

                c++;
            }

            var view_port = $(window).width();
            var enabled = true;
            var axis = {
                y: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Evts',
                        enabled: enabled
                    }
                }, {
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Km',
                        enabled: enabled
                    },
                    opposite: true,
                    min: 0
                }]
            }

            var min_x = c-31;
            var max_x = c-1;

            if(view_port < 750){
                min_x = c-7;
                max_x = c-1;
            }
            if(min_x < 0){
                min_x = 0;
            }

            $scope.harshAccelerationDataConfig = GraphConfigService.areaSplineChartConfig(series, category, min_x, max_x, axis);
        }

        function setHarshAccelDataAverage(harshAccel, granularity){
            $scope.harshAccelDataAverage = harshAccel;
            $scope.harshAccelDataAverageGranularity = granularity;
        }

        function setHarshAccelDataAverageChartConfig(harshAccel){
            var category = $rootScope.LANG.JOUR;

            var series =[{
                name: $rootScope.LANG.AVERAGE_PERIOD,
                type: 'spline',
                data: harshAccel.selectedTimeFramePerPeriod.acceleration,
                color:'#42A5F5',
                dashStyle: 'longdash'
            }, {
                name: $rootScope.LANG.AVERAGE_SIGN_IN,
                type: 'spline',
                data: harshAccel.sinceBeginningPerPeriod.acceleration,
                color:'#42A5F5',
                dashStyle: 'shortdot'
            }];

            var max_y = 0;
            var min_y = 999999;

            for (var i = 0; i < harshAccel.selectedTimeFramePerPeriod.acceleration.length; i++) {
                if (max_y < harshAccel.selectedTimeFramePerPeriod.acceleration[i]) max_y = harshAccel.selectedTimeFramePerPeriod.acceleration[i];
                if (min_y > harshAccel.selectedTimeFramePerPeriod.acceleration[i]) min_y = harshAccel.selectedTimeFramePerPeriod.acceleration[i];
            }

            for (var i = 0; i < harshAccel.sinceBeginningPerPeriod.acceleration.length; i++) {
                if (max_y < harshAccel.sinceBeginningPerPeriod.acceleration[i]) max_y = harshAccel.sinceBeginningPerPeriod.acceleration[i];
                if (min_y > harshAccel.sinceBeginningPerPeriod.acceleration[i]) min_y = harshAccel.sinceBeginningPerPeriod.acceleration[i];
            }

            var view_port = $(window).width();
            var enabled = true;

            var axis = {
                y: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Evts',
                        enabled: enabled
                    },
                    min: min_y,
                    max: max_y
                }]
            };

            $scope.harshAccelerationDataAverageChartConfig = GraphConfigService.splineChartConfig(series, category, min_y, max_y, axis);

        }

        $scope.showHarshEvent = function(event){

            var events = [event];

            $scope.mapEvents = events;

            $timeout(function(){
                BingService.map.map.setView({
                    zoom: 16
                });
                //console.log(BingService);
            }, 100);

        };

        $scope.prevPage = function() {
            if ($scope.harshEventTablePage > 0) {
                $scope.harshEventTablePage--;
            }
        };

        $scope.prevPageDisabled = function() {
            return $scope.harshEventTablePage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function() {
            return Math.ceil($scope.allHarshEvents.length/$scope.harshEventsTableItemsPerPage)-1;
        };

        $scope.nextPage = function() {
            if ($scope.harshEventTablePage < $scope.pageCount()) {
                $scope.harshEventTablePage++;
            }
        };

        $scope.nextPageDisabled = function() {
            return $scope.harshEventTablePage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.range = function() {
            var rangeSize = 5,
                ret = [],
                start;

            if(device.mobile()){
                rangeSize = 3;
            }

            start = $scope.harshEventTablePage;

            if ( start > $scope.pageCount() - rangeSize ) {
                start = $scope.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                if(i > -1) ret.push(i);
            }
            return ret;
        };

        $scope.setPage = function(n) {
            $scope.harshEventTablePage = n;
        };

        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $scope.$on('resetMap', function(){
            $scope.mapEvents = angular.copy($scope.allHarshEvents);
        });

        if(!$rootScope.noDevice && !$rootScope.noData) {
            $scope.getHarshEventsData('DAY');
            $scope.getHarshEventsDataAverage('DAY');
        }
    }]);
})();