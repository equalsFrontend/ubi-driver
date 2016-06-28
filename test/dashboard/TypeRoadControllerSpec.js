"use strict";

describe('TypeRoad Controller', function() {

    var typeRoad, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, DashboardService, config, stub,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.presentations.typeRoad.controllers'));

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

        typeRoad = $controller('TypeRoadController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        spyOn($state, 'go');
    }));

    describe('> TypeRoadController', function(){
        it('sets type road data', function(){
            $scope.setTypeRoadData(stub.TYPE_ROAD);

            expect($scope.typeRoadData).toEqual(stub.TYPE_ROAD);
        });

        it('sets type road data chart config', function() {
            $scope.setTypeRoadDataChartConfig(stub.TYPE_ROAD);

            expect($scope.typeRoadChartConfig).toBeDefined();
        });

        it('sets type road data average', function(){
            $scope.setTypeRoadAverage(stub.TYPE_ROAD_AVERAGE);

            expect($scope.typeRoadAverage).toEqual(stub.TYPE_ROAD_AVERAGE);
        });

        it('sets type road data average chart config', function() {
            $scope.setTypeRoadAverageChartConfig(stub.TYPE_ROAD_AVERAGE);

            expect($scope.typeRoadAverage1Config).toBeDefined();
            expect($scope.typeRoadAverage2Config).toBeDefined();
        });
    });
});