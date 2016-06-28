"use strict";

describe('Dashboard Controller', function() {

    var dashboard, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, DashboardService, config, stub,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.controllers'));

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

        dashboard = $controller('DashboardController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        spyOn($state, 'go');
    }));

    describe('> DashboardController', function(){
        it('toggles user popup class', function(){
            $('html').html('<div class="popup-user">&nbsp;</div>');

            $scope.toggleUserPopup();
            expect($('.popup-user').hasClass('active')).toBeTruthy();

            $scope.toggleUserPopup();
            expect($('.popup-user').hasClass('active')).toBeFalsy();
        });

        it('toggles menu class', function(){
            $scope.menuVisible = true;

            $scope.menuToggleHandler();
            expect($scope.menuVisible).toBeFalsy();

            $scope.menuToggleHandler();
            expect($scope.menuVisible).toBeTruthy();
        });

        it('cleans grade', function(){
            var grade = "A++",
                newGrade;

            newGrade = $scope.cleanGrade(grade);

            expect(newGrade).toEqual('A');
        });

        it('generates desktop picker', function(){

            $scope.machineEndDate = $scope.endDate;

            $scope.exposed.generateDesktopPicker($rootScope.startDate, $rootScope.endDate, true);
        });
    });
});