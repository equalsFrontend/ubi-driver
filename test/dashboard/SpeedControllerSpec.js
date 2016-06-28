"use strict";

describe('Speed Controller', function() {

    var speedController, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, DashboardService, config, stub,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.presentations.speed.controllers'));

    beforeEach(inject( function(_$rootScope_, _$controller_, _$httpBackend_, _$state_, _$timeout_, _$base64_, _localStorageService_, _DashboardService_, CONFIG, STUB){

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $state = _$state_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $localStorageService = _localStorageService_;
        DashboardService = _DashboardService_;
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
            MOIS: ['', '', '', '', '', '', '', '', '', '', '', '']
        };

        DashboardService.currentMachine = stub.MACHINE;

        speedController = $controller('SpeedController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        spyOn($state, 'go');
    }));

    describe('> SpeedController', function(){
        it('sets speed data', function(){
            $scope.setSpeedData(stub.SPEED);

            expect($scope.speedData).toEqual(stub.SPEED);
        });

        it('sets speed data chart config', function() {
            $scope.setSpeedDataChartConfig(stub.SPEED);

            expect($scope.speedDataConfig).toBeDefined();
        });

        it('sets speed data average', function(){
            $scope.setSpeedDataAverage(stub.SPEED_AVERAGE);

            expect($scope.speedDataAverage).toEqual(stub.SPEED_AVERAGE);
        });

        it('sets speed data average chart config', function() {
            $scope.setSpeedDataAverageChartConfig(stub.SPEED_AVERAGE);

            expect($scope.speedAverageConfig).toBeDefined();
        });
    });
});