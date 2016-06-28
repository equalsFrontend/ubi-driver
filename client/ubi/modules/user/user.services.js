/*jshint -W099*/

/**
 * iMetric
 * @module user/services
 * @author Alex Boisselle
 */


(function(){

    "use strict";

    var userServices = angular.module('UBIDriver.modules.user.services', [
        'base64'
    ])

    /**
     * @constructor UserService
     * @memberOf module:user/services
     */
    .factory('UserService', ['$q', '$http', 'PATHS', 'STUB', 'localStorageService', '$timeout', 'UserAuthService', function($q, $http, PATHS, STUB, localStorageService, $timeout, UserAuthService){
        return {
            /**
             * @function getUser
             * @param {string} un - username
             * @param {string} token - session token
             * @author Alex Boisselle
             * @memberOf module:user/services.UserService
             * @description gets user information from db, is used on login if session token is available to validate
             * @returns {object} user
             */
            getUser: function(){

                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '?token=' + UserAuthService.getToken(),
                    permissions = null,
                    data        = {};

                var req = {
                    method: 'GET',
                    url: url,
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                //for reference from outer modules
                permissions = this.permissions = STUB.PERMISSIONS;

                //data["permissions"] = permissions;
                //userDefer.resolve(data);


                $http(req)
                .success(function(data, status, headers, config){
                    data.user["permissions"] = permissions;

                    self.participant = data;

                    self.user = data.user;

                    console.log(data);

                    userDefer.resolve(data.user);
                })
                .error(function(data, status, headers, config){
                    userDefer.reject(status);
                });

                return userDefer.promise;
            },
            getUserAddresses: function(){
                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '/addresses/?token=' + UserAuthService.getToken(),
                    permissions = null,
                    data        = {};

                var req = {
                    method: 'GET',
                    url: url,
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                .success(function(data, status, headers, config){

                    self.addresses = data;

                    userDefer.resolve(data);
                })
                .error(function(data, status, headers, config){
                    userDefer.reject(status);
                });

                return userDefer.promise;
            },
            getUserVehicles: function(){
                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '/machines/?token=' + UserAuthService.getToken(),
                    permissions = null,
                    data        = {};

                var req = {
                    method: 'GET',
                    url: url,
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                    .success(function(data, status, headers, config){

                        self.vehicles = data;

                        userDefer.resolve(data);
                    })
                    .error(function(data, status, headers, config){
                        userDefer.reject(status);
                    });

                return userDefer.promise;
            },
            setUser: function(user){

                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '?token=' + UserAuthService.getToken();

                var req = {
                    method: 'PUT',
                    url: url,
                    data: user,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                .success(function(data, status, headers, config){
                    self.user = user;

                    self.user['username'] = user.user.username;

                    self.user.permissions = STUB.PERMISSIONS;

                    userDefer.resolve(data);
                })
                .error(function(data, status, headers, config){
                    userDefer.reject(status);
                });

                return userDefer.promise;
            },
            createUserAddress: function(address){
                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '/addresses/?token=' + UserAuthService.getToken(),
                    permissions = null,
                    data        = {};

                var req = {
                    method: 'POST',
                    url: url,
                    data: address,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                    .success(function(data, status, headers, config){

                        //put addresses in model
                        //self.addresses[addressid] = address;

                        userDefer.resolve(data);
                    })
                    .error(function(data, status, headers, config){
                        userDefer.reject(status);
                    });

                return userDefer.promise;
            },
            setUserAddress: function(address, addressId){
                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '/addresses/' + addressId + '?token=' + UserAuthService.getToken(),
                    permissions = null,
                    data        = {};

                var req = {
                    method: 'PUT',
                    url: url,
                    data: address,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                    .success(function(data, status, headers, config){

                        //put addresses in model
                        //self.addresses[addressid] = address;

                        userDefer.resolve(data);
                    })
                    .error(function(data, status, headers, config){
                        userDefer.reject(status);
                    });

                return userDefer.promise;
            },
            setVehicle: function(vehicle, vehicleName){
                var userDefer   = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + UserAuthService.getUsername() + '/vehicles/' + vehicleName + '/?token=' + UserAuthService.getToken(),
                    permissions = null,
                    data        = {};

                var req = {
                    method: 'PUT',
                    url: url,
                    data: vehicle,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                    .success(function(data, status, headers, config){

                        //put addresses in model
                        //self.addresses[addressid] = address;

                        userDefer.resolve(data);
                    })
                    .error(function(data, status, headers, config){
                        userDefer.reject(status);
                    });

                return userDefer.promise;
            },
            setGrade: function(discipline, grade){
                this.grades[discipline] = grade;
            },
            getGrade: function(discipline){
                return this.grades[discipline];
            },
            cleanGrade: function(grade){
                if(grade){
                    var clean = grade.replace(/\+/g,'');
                    clean = clean.replace(/\//g, '');
                    return clean;
                }
            },
            vehicles: {},
            addresses: {},
            grades: [],
            user: {}
        };
    }])

    /**
     * @constructor UserAuthService
     * @memberOf module:user/services
     */
    .factory('UserAuthService', ['$q', '$http', 'PATHS', 'localStorageService', '$timeout', '$base64', 'CONFIG', function($q, $http, PATHS, localStorageService, $timeout, $base64, CONFIG){
        return{
            /**
             * @function authenticate
             * @param {string} un - username
             * @param {string} pw - password
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @description attempts to authenticate user
             * @returns {object} user - token and id of user
             */
            authenticate: function(un, pw, remember) {
                var self              = this,
                    authenticateDefer = $q.defer(),
                    url               = PATHS.API + '/userdepot/' + PATHS.REALM + '/sessions',
                    emailRegEx        = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

                //if(emailRegEx.test(un)){
                //    url = PATHS.API + '/sessions/email';
                //}

                var req = {
                    method: 'POST',
                    url: url,
                    data: JSON.stringify({
                        username: un,
                        password: pw
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                .success(function(data, status, headers, config){
                    self.setSession(data.token, data.refreshToken, data.user.username, remember);

                    authenticateDefer.resolve(data.user);
                })
                .error(function(data, status, headers, config){
                    var errorObj = {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    };

                    authenticateDefer.reject(errorObj);
                });

                return authenticateDefer.promise;
            },
            /**
             * @function logout
             * @param {string} token - session token
             * @author Alex Boisselle
             * @memberOf module:user/services.UserService
             * @description logs out user and deletes token
             * @returns {object} promise
             */
            logout: function(){
                var self              = this,
                    authenticateDefer = $q.defer(),
                    url               = PATHS.API + '/userdepot/' + PATHS.REALM + '/sessions/' + self.getToken();

                var req = {
                    method: 'DELETE',
                    url: url,
                    data: {},
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                $http(req)
                .success(function(data, status, headers, config){
                    self.removeSession();

                    authenticateDefer.resolve();
                })
                .error(function(data, status, headers, config){
                    authenticateDefer.reject(status);
                });

                return authenticateDefer.promise;
            },
            /**
             * @function getToken
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @description gets session token/un/pw object from browser, decodes it into un and token
             * @param {boolean} pw - if this is set to true, the method will return the password as well
             * @returns {object} token package containing username, token and maybe password
             */
            getSession: function(){

                if(localStorageService.get(CONFIG.TOKEN.NAME)){
                    var encodedCombo = localStorageService.get(CONFIG.TOKEN.NAME).split(CONFIG.TOKEN.SPLITTER),
                        encodedUn, encodedToken, encodedRefreshToken,
                        cleanUn, cleanToken, cleanRefreshToken,
                        obj = {};

                    encodedUn = encodedCombo[0];
                    encodedToken = encodedCombo[1];
                    encodedRefreshToken = encodedCombo[2];

                    cleanUn = $base64.decode(encodedUn);
                    cleanToken = $base64.decode(encodedToken);
                    cleanRefreshToken = $base64.decode(encodedRefreshToken);

                    obj.username = cleanUn;
                    obj.token = cleanToken;
                    obj.refreshToken = cleanRefreshToken;

                    return obj;

                } else {

                    return false;

                }
            },
            /**
             * @function getUsername
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @description gets session username
             * @returns {string} the user's username
             */
            getUsername: function(){

                if(localStorageService.get(CONFIG.TOKEN.NAME)){
                    var encodedCombo = localStorageService.get(CONFIG.TOKEN.NAME).split(CONFIG.TOKEN.SPLITTER),
                        encodedUn,
                        cleanUn;

                    encodedUn = encodedCombo[0];

                    cleanUn = $base64.decode(encodedUn);

                    return cleanUn;

                } else {

                    return false;

                }
            },
            /**
             * @function getToken
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @description gets session token
             * @returns {string} the token
             */
            getToken: function(){

                if(localStorageService.get(CONFIG.TOKEN.NAME)){
                    var encodedCombo = localStorageService.get(CONFIG.TOKEN.NAME).split(CONFIG.TOKEN.SPLITTER),
                        encodedToken,
                        cleanToken;

                    encodedToken = encodedCombo[1];

                    cleanToken = $base64.decode(encodedToken);

                    return cleanToken;

                } else {

                    return false;

                }
            },
            /**
             * @function getRefreshToken
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @description gets session refresh token
             * @returns {string} the token
             */
            getRefreshToken: function(){

                if(localStorageService.get(CONFIG.TOKEN.NAME)){
                    var encodedCombo = localStorageService.get(CONFIG.TOKEN.NAME).split(CONFIG.TOKEN.SPLITTER),
                        encodedRefreshToken,
                        cleanToken;

                    encodedRefreshToken = encodedCombo[2];

                    cleanToken = $base64.decode(encodedRefreshToken);

                    return cleanToken;

                } else {

                    return false;

                }
            },
            scrambleToken: function(){
                var sessionObj          = this.getSession(),
                    sessionUn           = sessionObj.username,
                    sessionToken        = sessionObj.token,
                    sessionRefreshToken = sessionObj.refreshToken,
                    scrambledToken;

                scrambledToken = $base64.encode(angular.copy(sessionToken));

                this.setSession(scrambledToken, sessionRefreshToken, sessionUn);
            },
            refreshToken: function(){
                var q           = $q.defer(),
                    self        = this,
                    url         = PATHS.API + '/userdepot/' + PATHS.REALM + '/sessions';

                var req = {
                    method: 'PUT',
                    url: url,
                    data: {
                        "refreshToken": self.getRefreshToken()
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                        'Access-Control-Allow-Origin': '*'
                    }
                };

                //console.log("check for refresh promise");

                if(!this.refreshPromise){
                    this.refreshPromise = $http(req)
                    .success(function(data, status, headers, config){
                        //console.log("refreshed");
                        q.resolve(data);
                    })
                    .error(function(data, status, headers, config){
                        q.reject(status);
                    });
                }

                return this.refreshPromise;
            },
            /**
             * @function setSession
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @param {string} token - token acquired from server
             * @param {string} refreshToken - refresh token acquired from server
             * @param {string} un - un supplied
             * @param {string} pw - pw supplied
             * @description sets encoded session information to browser
             * @returns {object} encodedCombo - the final package
             */
            setSession: function(token, refreshToken, un, remember){

                var encodedToken        = $base64.encode(token),
                    encodedRefreshToken = $base64.encode(refreshToken),
                    encodedUn           = $base64.encode(un),
                    encodedCombo;

                encodedCombo = encodedUn + CONFIG.TOKEN.SPLITTER + encodedToken + CONFIG.TOKEN.SPLITTER + encodedRefreshToken;

                localStorageService.set(CONFIG.TOKEN.NAME, encodedCombo);

                if(remember) {
                    localStorageService.set(CONFIG.TOKEN.REMEMBER, remember);
                }

                return encodedCombo;
            },
            /**
             * @function removeSession
             * @author Alex Boisselle
             * @memberOf module:user/services.UserAuthService
             * @description deletes current session token from browser
             * @returns {boolean} promise
             */
            removeSession: function(){
                localStorageService.remove(CONFIG.TOKEN.NAME);
                localStorageService.remove(CONFIG.TOKEN.REMEMBER);
            }
        }
    }]);
})();