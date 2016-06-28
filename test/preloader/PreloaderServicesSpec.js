"use strict";

describe('Preloader Services', function() {

    var preloaderService, scope, http;

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.preloader.services'));

    beforeEach(inject( function(_PreloaderService_, $q, $http, $rootScope, _PATHS_, $httpBackend){

        preloaderService = _PreloaderService_;
        scope = $rootScope;
        http = $httpBackend;


    }));

    describe('> PreloaderService', function(){
        describe('.getLanguageFile', function() {

            it('returns promise after http', function(){

                http.expectGET('lang/'+ scope.currentLang + '.json').respond(200, 1);
                http.expectGET('client/ubi/modules/preloader/preloader.view.html').respond({});

                preloaderService.getLanguageFile().then(function(data) {
                    expect(data).toEqual(1);
                });

                http.flush();
                scope.$apply();
            });

            it('rejects promise with bad url', function(){

                http.expectGET('lang/'+ scope.currentLang + '.json').respond(404, false);
                http.expectGET('client/ubi/modules/preloader/preloader.view.html').respond({});

                preloaderService.getLanguageFile().then(function(){

                }, function(data){
                    expect(data).toEqual(404);
                });

                http.flush();
                scope.$apply();
            });
        });
    });
});