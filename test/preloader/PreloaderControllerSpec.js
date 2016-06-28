"use strict";

describe('Preloader Controllers', function() {

    var preloaderController, userService, $rootScope, $scope, $controller, $timeout, $state, $httpBackend, $localStorageService, config,
        fakeUn = "name", fakeToken = "jl34ljsdf", fakePw = "pw";

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.preloader.controllers'));
    beforeEach(module('UBIDriver.modules.user.services'));

    beforeEach(inject( function(_UserService_, _$rootScope_, _$controller_, _$httpBackend_, _$state_, _$timeout_, _$base64_, _localStorageService_, CONFIG){

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $state = _$state_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $localStorageService = _localStorageService_;
        config = CONFIG;

        preloaderController = $controller('PreloaderController', {
            '$rootScope': $rootScope,
            '$scope': $scope
        });

        userService = _UserService_;

        $httpBackend.expectGET('lang/' + $scope.currentLang + '.json').respond(200, 1);
        $httpBackend.expectGET('client/ubi/modules/preloader/preloader.view.html').respond(200, 1);
        $httpBackend.whenGET('client/ubi/modules/user/user.view.html').respond(200, 1);

        spyOn(userService, 'getUser').andCallFake(function(){
            return {
                then: function() { return true; }
            };
        });
        spyOn($state, 'go');

    }));

    describe('> PreloaderContoller', function(){

        it('loads and sets a lang file', function(){

            $httpBackend.flush();
            $scope.$apply();

            expect($scope.LANG).toBeDefined();

        });

        describe('Q: locally stored token and username?', function(){
            it('no, user is brought to login page', function(){

                if($localStorageService.get(config.TOKEN.NAME)){
                    $localStorageService.remove(config.TOKEN.NAME);
                }

                $httpBackend.flush();
                $timeout.flush();
                $scope.$apply();

                expect($state.go).toHaveBeenCalledWith('user.login');

            });

            //it('yes, it tries to validate with db with getUser', function(){
            //
            //    $localStorageService.set(config.TOKEN.NAME, fakeUn + config.TOKEN.SPLITTER + fakeToken + config.TOKEN.SPLITTER + fakePw);
            //
            //    $httpBackend.flush();
            //    $scope.$apply();
            //
            //    expect(userService.getUser).toHaveBeenCalled();
            //
            //});

            describe('Q: token valid?', function(){
                it('no, brings user back to login page', function(){
                    return true;
                });

                it('yes, brings user to summary page', function(){
                    return true;
                });
            });
        });

    });
});