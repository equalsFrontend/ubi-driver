"use strict";

describe('Presentation Services', function() {

    var summaryService,
        speedService,
        timeUseService,
        typeRoadService,
        co2Service,
        drivingLocationService,
        mileageService,
        harshEventsService,
        dashboardService;

    var rootScope,
        scope,
        controller;

    var localStorageService,
        http,
        timeout,
        state,
        config,
        stub,
        paths;

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.services'));

    beforeEach(inject( function(_SummaryService_,
                                _SpeedService_,
                                _TimeUseService_,
                                _TypeRoadService_,
                                _Co2Service_,
                                _DrivingLocationService_,
                                _MileageService_,
                                _HarshEventsService_,
                                _DashboardService_,
                                _$rootScope_, _$controller_, $q, $http, _PATHS_, _STUB_, $httpBackend, _localStorageService_, _$timeout_, _$state_, _CONFIG_){

        //services we will be testing
        summaryService         = _SummaryService_;
        speedService           = _SpeedService_;
        timeUseService         = _TimeUseService_;
        typeRoadService        = _TypeRoadService_;
        co2Service             = _Co2Service_;
        drivingLocationService = _DrivingLocationService_;
        mileageService         = _MileageService_;
        harshEventsService     = _HarshEventsService_;
        dashboardService       = _DashboardService_;

        //necessary scope ref
        rootScope              = _$rootScope_;
        scope                  = rootScope.$new();
        controller             = _$controller_;

        //extra modules and constants needed
        localStorageService    = _localStorageService_;
        http                   = $httpBackend;
        timeout                = _$timeout_;
        state                  = _$state_;
        config                 = _CONFIG_;
        stub                   = _STUB_;
        paths                  = _PATHS_;

        dashboardService.currentMachine = stub.MACHINE;

        http.expectGET('client/ubi/modules/preloader/preloader.view.html').respond({});

        rootScope.startDate = {
            "full": "2014-01-08"
        };

        rootScope.endDate = {
            "full": "2014-01-10"
        };
    }));

    describe('> SummaryService', function(){

        module('UBIDriver.modules.dashboard.presentations.summary.services');

        describe('.getSummaryData', function() {

            it('returns summary json object', function(){

                http.when('GET', paths.API + '/machines/undefined/summary/2014-01-10?token=false').respond(stub.SUMMARY);

                summaryService.getSummaryData().then(function(data){

                    expect(data).toEqual(stub.SUMMARY);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/summary/2014-01-10?token=false').respond(401, '');

                rootScope.endDate = {
                    "full": "2014-01-10"
                };

                summaryService.getSummaryData().then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });

        });

        describe('.getCalendarDate', function() {

            it('returns date', function(){

                http.when('GET', paths.API + '/machines/APPMUBI/activity/2014/01?token=false').respond(stub.DATE);

                summaryService.getCalendarDate().then(function(data){

                    expect(data).toEqual(stub.DATE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/APPMUBI/activity/2014/01?token=false').respond(401, '');

                summaryService.getCalendarDate().then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });

        });
    });

    describe('> SpeedService', function(){

        module('UBIDriver.modules.dashboard.presentations.speed.services');

        describe('.getSpeedData', function() {

            it('returns speed json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/speed?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.SPEED);



                speedService.getSpeedData('DAY').then(function(data){

                    expect(data).toEqual(stub.SPEED);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/speed?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                speedService.getSpeedData('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });

        });

        describe('.getSpeedDataAverage', function() {

            it('returns speed average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/speed/average/DAY?token=false&startDate=2014-01-08&endDate=2014-01-10').respond(stub.SPEED_AVERAGE);

                speedService.getSpeedDataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.SPEED_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/speed/average/DAY?token=false&startDate=2014-01-08&endDate=2014-01-10').respond(401, '');

                speedService.getSpeedDataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });

        });
    });

    describe('> MileageService', function(){

        module('UBIDriver.modules.dashboard.presentations.mileage.services');

        describe('.getMileageData', function() {

            it('returns speed json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/mileage?granularity=DAY&startDate=2014-01-08&endDate=2014-01-10&token=false').respond(stub.MILEAGE);

                mileageService.getMileageData('DAY').then(function(data){

                    expect(data).toEqual(stub.MILEAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/mileage?granularity=DAY&startDate=2014-01-08&endDate=2014-01-10&token=false').respond(401, '');

                mileageService.getMileageData('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.getMileageDataAverage', function() {

            it('returns speed average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/mileage/average/DAY?startDate=2014-01-08&endDate=2014-01-10&token=false').respond(stub.MILEAGE_AVERAGE);

                mileageService.getMileageDataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.MILEAGE_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/mileage/average/DAY?startDate=2014-01-08&endDate=2014-01-10&token=false').respond(401, '');

                mileageService.getMileageDataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });
    });

    describe('> HarshEventsService', function(){

        module('UBIDriver.modules.dashboard.presentations.harshEvents.services');

        describe('.getHarshEventsData', function() {

            it('returns harsh events json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/harsh-events/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY&eventsDetails=false').respond(stub.HARSH_EVENTS);

                harshEventsService.getHarshEventsData('DAY').then(function(data){

                    expect(data).toEqual(stub.HARSH_EVENTS);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/harsh-events/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY&eventsDetails=false').respond(401, '');

                harshEventsService.getHarshEventsData('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.gethHarshEventsTable', function() {

            it('returns harsh events table json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/harsh-events/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY&eventsDetails=true').respond(stub.HARSH_EVENTS);

                harshEventsService.gethHarshEventsTable('DAY').then(function(data){

                    expect(data).toEqual(stub.HARSH_EVENTS);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/harsh-events/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY&eventsDetails=true').respond(401, '');

                harshEventsService.gethHarshEventsTable('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.gethHarshEventDayAverage', function() {

            it('returns harsh events average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/harsh-events/average/DAY?token=false&startDate=2014-01-08&endDate=2014-01-10&eventsDetails=true').respond(stub.HARSH_EVENTS_AVERAGE);

                harshEventsService.getHarshEventsDataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.HARSH_EVENTS_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/harsh-events/average/DAY?token=false&startDate=2014-01-08&endDate=2014-01-10&eventsDetails=true').respond(401, '');

                harshEventsService.getHarshEventsDataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });
    });

    describe('> Co2Service', function(){

        module('UBIDriver.modules.dashboard.presentations.co2.services');

        describe('.getCo2Data', function() {

            it('returns co2 json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/co2/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.CO2);

                co2Service.getCo2Data('DAY').then(function(data){

                    expect(data).toEqual(stub.CO2);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/co2/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                co2Service.getCo2Data('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.getCo2DataAverage', function() {

            it('returns co2 average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/co2/average/DAY?token=false&startDate=2014-01-08&endDate=2014-01-10').respond(stub.CO2_AVERAGE);

                co2Service.getCo2DataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.CO2_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/co2/average/DAY?token=false&startDate=2014-01-08&endDate=2014-01-10').respond(401, '');

                co2Service.getCo2DataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });
    });

    describe('> TimeUse', function(){

        module('UBIDriver.modules.dashboard.presentations.timeUse.services');

        describe('.getTimeUseData', function() {

            it('returns time of use json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/time-of-use/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.TIME_USE);

                timeUseService.getTimeUseData('DAY').then(function(data){

                    expect(data).toEqual(stub.TIME_USE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/time-of-use/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                timeUseService.getTimeUseData('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.getTimeUseDataAverage', function() {

            it('returns time of use average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/time-of-use/average?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.TIME_USE_AVERAGE);

                timeUseService.getTimeUseDataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.TIME_USE_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/time-of-use/average?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                timeUseService.getTimeUseDataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });
    });

    describe('> TypeRoad', function(){

        module('UBIDriver.modules.dashboard.presentations.typeRoad.services');

        describe('.getTypeRoadData', function() {

            it('returns type of road json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/type-of-road/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.TYPE_ROAD);

                typeRoadService.getTypeRoadData('DAY').then(function(data){

                    expect(data).toEqual(stub.TYPE_ROAD);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/type-of-road/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                typeRoadService.getTypeRoadData('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.getTypeRoadDataAverage', function() {

            it('returns time of use average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/type-of-road/average?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.TYPE_ROAD_AVERAGE);

                typeRoadService.getTypeRoadDataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.TYPE_ROAD_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/type-of-road/average?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                typeRoadService.getTypeRoadDataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });
    });

    describe('> DrivingLocation', function(){

        module('UBIDriver.modules.dashboard.presentations.drivingLocation.services');

        describe('.getDrivingLocationData', function() {

            it('returns driving location json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/driving-location/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.DRIVING_LOCATION);

                drivingLocationService.getDrivingLocationData('DAY').then(function(data){

                    expect(data).toEqual(stub.DRIVING_LOCATION);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/driving-location/?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                drivingLocationService.getDrivingLocationData('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.getDrivingLocationDataAverage', function() {

            it('returns driving location average json obj', function(){

                http.when('GET', paths.API + '/machines/undefined/driving-location/average?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(stub.DRIVING_LOCATION_AVERAGE);

                drivingLocationService.getDrivingLocationDataAverage('DAY').then(function(data){

                    expect(data).toEqual(stub.DRIVING_LOCATION_AVERAGE);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
                scope.$apply();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/machines/undefined/driving-location/average?token=false&startDate=2014-01-08&endDate=2014-01-10&granularity=DAY').respond(401, '');

                drivingLocationService.getDrivingLocationDataAverage('DAY').then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });
    });
});