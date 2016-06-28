"use strict";

describe('User Services', function() {

    var userService, userAuthService, scope, q, http, localStorageService, timeout, state, config, stub, paths, base64, fakeStorageService = {};

    var user = {
        username: 'application',
        password: 'application',
        token: null,
        email: null,
        permissions: null
    }

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.user.services'));

    beforeEach(inject( function(_UserService_, _UserAuthService_, $q, $http, $rootScope, _PATHS_, _STUB_, $httpBackend, _localStorageService_, _$timeout_, _$state_, CONFIG, _$base64_){

        userService         = _UserService_;
        userAuthService     = _UserAuthService_;
        scope               = $rootScope;
        q                   = $q;
        http                = $httpBackend;
        localStorageService = _localStorageService_;
        timeout             = _$timeout_;
        state               = _$state_;
        config              = CONFIG;
        stub                = _STUB_;
        paths               = _PATHS_;
        base64              = _$base64_;

        http.expectGET('client/ubi/modules/preloader/preloader.view.html').respond({});

        spyOn(userAuthService, 'setSession');
        spyOn(userAuthService, 'removeSession');

        spyOn(localStorageService, 'get').andCallFake(function(key) {
            return fakeStorageService[key];
        });
        spyOn(localStorageService, 'set').andCallFake(function(key, value) {
            fakeStorageService[key] = value;
        });

        spyOn(state, 'go');
    }));

    afterEach(function(){
        fakeStorageService = {};
    });

    describe('> UserAuthService', function(){
        describe('.authenticate', function() {

            describe('Q: username and password valid?', function(){

                it('no, rejects promise', function(){

                    http.when('POST', paths.API + '/sessions').respond(401, '');

                    userAuthService.authenticate(null, null).then(function(){
                        expect(0).toEqual(1);
                    }, function(response){
                        //expect in success block should fail if run, however it doesn't run, so this suite passes
                    });

                    http.flush();
                });

                it('yes, returns promise containing user data object then fires setSession with token arg', function(){

                    http.when('POST', paths.API + '/sessions').respond(200, stub.SESSION);

                    userAuthService.authenticate(user.username, user.password).then(function(data) {

                        //returns necessary attrib?
                        expect(data).toBeDefined();
                        expect(typeof data).toEqual('object');
                        expect(data.username).toBeDefined();
                        expect(data.email).toBeDefined();

                        expect(userAuthService.setSession).toHaveBeenCalledWith(stub.SESSION.token, user.username, user.password, undefined);

                        //set obj for ref in future tests
                        user.username = data.username;
                        user.email = data.email;
                    });

                    http.flush();
                    timeout.flush();
                    scope.$apply();
                });

            });
        });

        describe('.logout', function() {

            it('calls remove session', function(){
                http.when('DELETE', paths.API + '/sessions/false').respond(200);

                userAuthService.logout().then(function () {
                    expect(userAuthService.removeSession).toHaveBeenCalled();
                });

                http.flush();
            });

            it('rejects if fail', function(){

                http.when('DELETE', paths.API + '/sessions/false').respond(401);

                userAuthService.logout().then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        //describe('.setSession', function(){
        //    it('sets encoded session token username and pass', function(){
        //
        //        var encodedSession = userAuthService.setSession(stub.SESSION.token, user.username, user.password);
        //
        //        //logic taken from getSession
        //        var encodedCombo = encodedSession.split(config.TOKEN.SPLITTER),
        //            encodedToken, encodedUn, encodedPw,
        //            cleanToken, cleanUn, cleanPw;
        //
        //        encodedUn = encodedCombo[0];
        //        encodedToken = encodedCombo[1];
        //        encodedPw = encodedCombo[2];
        //
        //        cleanUn = base64.decode(encodedUn);
        //        cleanToken = base64.decode(encodedToken);
        //        cleanPw = base64.decode(encodedPw);
        //
        //        expect(cleanUn).toEqual(user.username);
        //        expect(cleanToken).toEqual(stub.SESSION.token);
        //        expect(cleanPw).toEqual(user.password);
        //    });
        //});

        describe('.getSession', function() {
            it('decodes and returns session object', function(){

                //logic taken fright from setSession
                var encodedUn = base64.encode(user.username),
                    encodedToken = base64.encode(stub.SESSION.token),
                    encodedPw = base64.encode(user.password),
                    encodedCombo;

                encodedCombo = encodedUn + config.TOKEN.SPLITTER + encodedToken + config.TOKEN.SPLITTER + encodedPw;

                localStorageService.set(config.TOKEN.NAME, encodedCombo);

                var session = userAuthService.getSession(true);

                expect(session.username).toEqual(user.username);
                expect(session.token).toEqual(stub.SESSION.token);
                expect(session.password).toEqual(user.password);

            });
        });

        describe('.getUsername', function() {
            it('decodes and returns username', function(){

                //logic taken fright from setSession
                var encodedUn = base64.encode(user.username),
                    encodedToken = base64.encode(stub.SESSION.token),
                    encodedPw = base64.encode(user.password),
                    encodedCombo;

                encodedCombo = encodedUn + config.TOKEN.SPLITTER + encodedToken + config.TOKEN.SPLITTER + encodedPw;

                localStorageService.set(config.TOKEN.NAME, encodedCombo);

                var username = userAuthService.getUsername(true);

                expect(username).toEqual(user.username);

            });
        });

        describe('.getToken', function() {
            it('decodes and returns session token', function(){

                //logic taken fright from setSession
                var encodedUn = base64.encode(user.username),
                    encodedToken = base64.encode(stub.SESSION.token),
                    encodedPw = base64.encode(user.password),
                    encodedCombo;

                encodedCombo = encodedUn + config.TOKEN.SPLITTER + encodedToken + config.TOKEN.SPLITTER + encodedPw;

                localStorageService.set(config.TOKEN.NAME, encodedCombo);

                var token = userAuthService.getToken(true);

                expect(token).toEqual(stub.SESSION.token);

            });
        });
    });


    describe('> UserService', function(){
        describe('.getUser', function() {

            describe('username and token valid?', function(){

                it('no, rejects promise', function(){
                    userService.getUser(null, null).then(function(){

                    }, function(response){
                        expect(response).toEqual(false);
                    });
                });

                it('yes, promise containing username and permissions', function(){

                    var user = stub.SESSION;

                    user.permissions = stub.PERMISSIONS;

                    http.when('GET', paths.API + '/users/false?token=false').respond(user);

                    userService.getUser(user.username, user.token).then(function(data) {

                        expect(data).toBeDefined();

                        expect(data.permissions).toBeDefined();
                        expect(typeof data.permissions).toEqual('object');

                        user.permissions = data.permissions;
                    });

                    http.flush();
                    timeout.flush();
                    scope.$apply();
                });

                it('rejects when not used correctly', function(){
                    http.when('GET', paths.API + '/users/false?token=false').respond(401, '');

                    userService.getUser(null, null).then(function(){
                        expect(0).toEqual(1);
                    }, function(response){
                        //expect in success block should fail if run, however it doesn't run, so this suite passes
                    });

                    http.flush();
                });
            });
        });

    });

});