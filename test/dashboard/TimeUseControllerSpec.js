"use strict";

describe('TimeUse Controller', function() {

    var timeUse, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, DashboardService, config, stub,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.presentations.timeUse.controllers'));

    beforeEach(inject( function(_$rootScope_, _$controller_, _$httpBackend_, _$state_, _$timeout_, _$base64_, _localStorageService_, _DashboardService_, CONFIG, STUB){

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $state = _$state_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $localStorageService = _localStorageService_;
        DashboardService = _DashboardService_
        config = CONFIG;
        stub = STUB;

        $rootScope.startDate = {
            full: "2015-01-01",
            year: "2015",
            month: "01",
            day: "01"
        };

        $rootScope.endDate = {
            full: "2015-05-01",
            year: "2015",
            month: "05",
            day: "01"
        };

        $rootScope["LANG"] = {
            AVERAGE_SPEED: "",
            KILOMETERS: "",
            AVERAGE_PERIOD: "",
            AVERAGE_SIGN_IN: "",
            GRADE: ['', '', '', '', '', '', '', '', ''],
            JOUR: ['', '', '', '', '', '', ''],
            MOIS: ['', '', '', '', '', '', '', '', '', '', '', ''],
            MORNING: '',
            AFTERNOON: '',
            EVENING: '',
            NIGHT: ''
        };

        DashboardService.currentMachine = stub.MACHINE;

        timeUse = $controller('TimeUseController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        spyOn($state, 'go');
    }));

    describe('> TimeUseController', function(){
        it('sets time use data', function(){
            $scope.setTimeUseData(stub.TIME_USE);

            expect($scope.timeUseData).toEqual(stub.TIME_USE);
        });

        it('sets time use data chart config', function() {
            $scope.setTimeUseDataChartConfig(stub.TIME_USE);

            expect($scope.timeUseChartConfig).toBeDefined();
        });

        it('sets time use data average', function(){
            $scope.setTimeUseAverage(stub.TIME_USE_AVERAGE);

            expect($scope.timeUseAverage).toEqual(stub.TIME_USE_AVERAGE);
        });

        it('sets time use data average chart config', function() {
            $scope.setTimeUseAverageChartConfig(stub.TIME_USE_AVERAGE);

            expect($scope.timeUseAverage1Config).toBeDefined();
            expect($scope.timeUseAverage2Config).toBeDefined();
        });
    });
});