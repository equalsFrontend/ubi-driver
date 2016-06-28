"use strict";

describe('DrivingLocation Controller', function() {

    var drivingLocation, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, DashboardService, config, stub,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.presentations.drivingLocation.controllers'));

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

        drivingLocation = $controller('DrivingLocationController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        spyOn($state, 'go');
    }));

    describe('> DrivingLocationController', function(){
        it('sets type road data', function(){
            $scope.setDrivingLocationData(stub.DRIVING_LOCATION);

            expect($scope.drivingLocationData).toEqual(stub.DRIVING_LOCATION);
        });

        it('sets type road data chart config', function() {
            $scope.setDrivingLocationDataChartConfig(stub.DRIVING_LOCATION);

            expect($scope.drivingLocationChartConfig).toBeDefined();
        });

        it('sets type road data average', function(){
            $scope.setDrivingLocationDataAverage(stub.DRIVING_LOCATION_AVERAGE);

            expect($scope.drivingLocationDataAverage).toEqual(stub.DRIVING_LOCATION_AVERAGE);
        });

        it('sets type road data average chart config', function() {
            $scope.setDrivingLocationDataAverageChartConfig(stub.DRIVING_LOCATION_AVERAGE);

            expect($scope.drivingLocationAverage1Config).toBeDefined();
            expect($scope.drivingLocationAverage2Config).toBeDefined();
        });
    });
});