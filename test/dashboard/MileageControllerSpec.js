"use strict";

describe('Mileage Controller', function() {

    var mileageController, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, DashboardService, config, stub,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.presentations.mileage.controllers'));

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
            MOIS: ['', '', '', '', '', '', '', '', '', '', '', '']
        };

        DashboardService.currentMachine = stub.MACHINE;

        mileageController = $controller('MileageController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        spyOn($state, 'go');
    }));

    describe('> MileageController', function(){
        it('sets mileage data', function(){
            $scope.setMileageData(stub.MILEAGE);

            expect($scope.mileageData).toEqual(stub.MILEAGE);
        });

        it('sets mileage data chart config', function() {
            $scope.setMileageDataChartConfig(stub.MILEAGE);

            expect($scope.mileageDataConfig).toBeDefined();
        });

        it('sets mileage data average', function(){
            $scope.setMileageDataAverage(stub.MILEAGE_AVERAGE);

            expect($scope.mileageAverage).toEqual(stub.MILEAGE_AVERAGE);
        });

        it('sets mileage data average chart config', function() {
            $scope.setMileageDataAverageChartConfig(stub.MILEAGE_AVERAGE);

            expect($scope.mileageAverageConfig).toBeDefined();
        });
    });
});