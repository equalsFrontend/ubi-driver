/*jshint -W099*/

/**
 * iMetric
 * @module UBIDriver
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var UBIDriverModule = angular.module('UBIDriver',
        [
            'ui.router',
            'LocalStorageModule',
            'angularLoad',
            'ngAnimate',
            'ngMaterial',
            'ngDialog',
            'highcharts-ng',
            'cfp.hotkeys',
            'angular-loading-bar',
            'UBIDriver.constants',
            'UBIDriver.modules.preloader',
            'UBIDriver.modules.user',
            'UBIDriver.modules.dashboard'
        ]
    )
    .config(["cfpLoadingBarProvider", "$httpProvider", "highchartsNGProvider", "$urlRouterProvider", "$mdThemingProvider", "$locationProvider", "localStorageServiceProvider", function(cfpLoadingBarProvider, $httpProvider, highchartsNGProvider, $urlRouterProvider, $mdThemingProvider, $locationProvider, localStorageServiceProvider){

        $httpProvider.interceptors.push('RefreshTokenInterceptor');

        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;

        $mdThemingProvider.definePalette('client', {
            '50': "#e8e8e8",
            '100': "#e8e8e8",
            '200': "#e8e8e8",
            '300': "#e8e8e8",
            '400': "#d6d6d6",
            '500': "#d6d6d6",
            '600': "#d6d6d6",
            '700': "#d6d6d6",
            '800': "#d6d6d6",
            '900': "#65656a",
            'A100': "#65656a",
            'A200': "#65656a",
            'A400': "#65656a",
            'A700': "#65656a",
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '100 200 300 400 A100',
            'contrastStrongLightColors': '500 600 700 A200 A400 A700'
        });
        $mdThemingProvider.theme('default').primaryPalette("client");

        localStorageServiceProvider
        .setPrefix('UBIDriver')
        .setStorageType('localStorage')
        .setStorageCookie(0.3);

        //$locationProvider.html5Mode(true);
    }])
    .factory('RefreshTokenService', ['$state', function($state){
        return {
            updateUrlParameter: function(uri, key, value){
                // remove the hash part before operating on the uri
                var i = uri.indexOf('#');
                var hash = i === -1 ? '' : uri.substr(i);
                uri = i === -1 ? uri : uri.substr(0, i);

                var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                if (uri.match(re)) {
                    uri = uri.replace(re, '$1' + key + "=" + value + '$2');
                } else {
                    uri = uri + separator + key + "=" + value;
                }
                return uri + hash;  // finally append the hash as well
            },
            toggleBodyClasses: function(login){
                angular.element(document.querySelector('.preloader .logo')).addClass('loaded');
                angular.element(document.querySelector('body')).removeClass('preloader');
                angular.element(document.querySelector('body')).addClass('dashboard');

                if(login){
                    angular.element(document.querySelector('body')).addClass('login');
                }
            },
            failToLogin: function(){
                this.toggleBodyClasses(true);
                $state.go('user.login');
            }
        }
    }])
    .factory('RefreshTokenInterceptor', ['$q', '$injector', function($q, $injector) {
        return {
            responseError: function(rejection) {

                var UserAuthService     = $injector.get("UserAuthService"),
                    refreshTokenService = $injector.get("RefreshTokenService"),

                    $http      = $injector.get('$http'),
                    $state     = $injector.get('$state'),
                    $rootScope = $injector.get('$rootScope'),
                    $timeout   = $injector.get('$timeout');

                //Call failed, try to refresh the token
                //If it isn't a refresh token
                //and it's actually an "expired" type
                if(!rejection.config.data.refreshToken && rejection.data.message.indexOf('expired') > -1) {

                    if(rejection.status == 401 || rejection.status == -1){

                        return $q.resolve(UserAuthService.refreshToken()).then(function(result){

                            var response = result.data;

                            UserAuthService.setSession(response.token, response.refreshToken, response.user.username);

                            rejection.config.url = refreshTokenService.updateUrlParameter(rejection.config.url, 'token', response.token);

                            return $http(rejection.config);

                        }, function(response){

                            UserAuthService.removeSession();
                            refreshTokenService.failToLogin();

                            return $q.reject(rejection);
                        }, function(response){

                            return "progress callback";
                        });
                    } else {
                        return $q.reject(rejection);
                    }

                //This is a failed call to refresh the token
                } else {
                    if (rejection.status == 401 || rejection.status == -1) {

                        UserAuthService.removeSession();
                        refreshTokenService.failToLogin();

                        return $q.reject(rejection);
                    } else {
                        $rootScope.refreshing = false;
                    }
                }
            }
        };
    }])
    .run(['$location', '$rootScope', '$state', '$stateParams', 'localStorageService', 'PATHS', function($location, $rootScope, $state, $stateParams, localStorageService, PATHS){

        //sets the state and state params to root for access when setting "active" tabs
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.location = $location;

        /**
         * @function $onMany
         * @author Alex Boisselle
         * @param {array} events - a list of events to watch
         * @param {function} fn - a common callback for each of them
         * @description lets you bind to multiple event broadcasts in a clean way with a common callback fn
         * @fires $onMany
         */
        $rootScope.$onMany = function(events, fn) {
            for(var i = 0; i < events.length; i++) {
                this.$on(events[i], fn);
            }
        };

        $rootScope.PATHS = PATHS;

        if(localStorageService.get('currentLang')){

            $rootScope.currentLang = localStorageService.get('currentLang');

        } else {

            localStorageService.set('currentLang', "fr");
            $rootScope.currentLang = "fr";

        }

        $location.path('/loading');
    }]);

    /**
     * Setup of main UBIDriver constants
     *
     */
    var UBIDriverConstants = angular.module('UBIDriver.constants', [])

        .constant("CONFIG", (function(){

            return {
                /**
                 *  @constant
                 *  @default
                 */
                "NAME": 'UBIDriver',

                /**
                 *  @constant
                 *  @default
                 */
                "VERSION": '3.0.0',

                "TOKEN": {
                    "NAME": "imetrik_securetoken",
                    "REMEMBER": "mr",
                    "SPLITTER": "%^%"
                },

                "BING": {
                    "CREDENTIALS": "Am-t_QYeujX69conFlHEyWMZDjVoe7M0jYDsK8UdWwRO5WMW83zV1DWH9DrUUAjQ"
                }
            };

        })())

        .constant("PATHS", (function(){

            var appPath = "client/ubi/";

            return {
                /**
                 *  @constant
                 *  @default
                 */
                "APP":  appPath,

                /**
                 *  @constant
                 *  @default
                 */
                "API": (function(){

                    //alpha
                    if(location.host.indexOf('alpha') > -1) {
                        return "";

                    //beta
                    } else if(location.host.indexOf('beta') > -1){
                        return "";

                    //local or integration
                    } else if(location.host.indexOf('integration') > -1 || location.host.indexOf('localhost') > -1 || location.host.indexOf('10.10') > -1){
                        return "";

                    //prod
                    } else if (location.host.indexOf('maif.insurance.imetrik.com') > -1 || location.host.indexOf('maif.microsite.imetrik.com') > -1 || location.host.indexOf('maifandgo.fr') > -1) {
                        return "";

                    //demo
                    } else {
                        return "";
                    }
                })(),

                /**
                 *  @constant
                 *  @default
                 */
                "MICROSITE": (function(){

                    //local or integration
                    if(location.host.indexOf('integration') > -1 || location.host.indexOf('localhost') > -1){
                        return "http://integration.maif.microsite.imetrik.com/";

                        //beta internal
                    } else if (location.host.indexOf('beta') > -1) {
                        return "http://beta.maif.microsite.imetrik.com/";

                    //prod internal
                    } else if (location.host.indexOf('maif.insurance.imetrik.com') > -1 || location.host.indexOf('maif.microsite.imetrik.com') > -1) {
                        return "http://maif.microsite.imetrik.com/";

                    //prod external
                    } else if (location.host.indexOf('maifandgo.fr') > -1) {
                        return "https://www.maifandgo.fr/";

                    //demo
                    } else {
                        return "http://alpha.maif.microsite.imetrik.com/";
                    }
                })(),

                /**
                 *  @constant
                 *  @default
                 */
                "REALM": "maif_ubi",

                /**
                 *  @constant
                 *  @default
                 */
                "CSS": "css/",

                /**
                 *  @constant
                 *  @default
                 */
                "SASS": "scss/",

                /**
                 *  @constant
                 *  @default
                 */
                "TEST": "test/",

                /**
                 *  @constant
                 *  @default
                 */
                "LANG": "lang/",

                /**
                 *  @constant
                 *  @default
                 */
                "FONTS": "fonts/",

                /**
                 *  @constant
                 *  @default
                 */
                "IMAGES": "images/",

                /**
                 *  @constant
                 *  @default
                 */
                "CLIENT": "client/",

                /**
                 *  @constant
                 *  @default
                 */
                "COMPONENTS": appPath + "components/",

                /**
                 *  @constant
                 *  @default
                 */
                "BING": appPath + "components/bing/",

                /**
                 *  @constant
                 *  @default
                 */
                "DATERANGEPICKER": appPath + "components/daterangepicker/",

                /**
                 *  @constant
                 *  @default
                 */
                "MODULES": appPath + "modules/",

                /**
                 *  @constant
                 *  @default
                 */
                "PRELOADER": appPath + "modules/preloader/",

                /**
                 *  @constant
                 *  @default
                 */
                "USER": appPath + "modules/user/",

                /**
                 *  @constant
                 *  @default
                 */
                "DASHBOARD": appPath + "modules/dashboard/",

                /**
                 *  @constant
                 *  @default
                 */
                "PROFILE": appPath + "modules/user/",

                /**
                 *  @constant
                 *  @default
                 */
                "PRESENTATIONS": appPath + "modules/dashboard/presentations/",

                /**
                 *  @constant
                 *  @default
                 */
                "SPEED": appPath + "modules/dashboard/presentations/speed/",

                /**
                 *  @constant
                 *  @default
                 */
                "MILEAGE": appPath + "modules/dashboard/presentations/mileage/",

                /**
                 *  @constant
                 *  @default
                 */
                "SUMMARY": appPath + "modules/dashboard/presentations/summary/",

                /**
                 *  @constant
                 *  @default
                 */
                "TIMEUSE": appPath + "modules/dashboard/presentations/timeUse/",

                /**
                 *  @constant
                 *  @default
                 */
                "TYPEROAD": appPath + "modules/dashboard/presentations/typeRoad/",

                /**
                 *  @constant
                 *  @default
                 */
                "CO2": appPath + "modules/dashboard/presentations/co2/",

                /**
                 *  @constant
                 *  @default
                 */
                "HARSHEVENTS": appPath + "modules/dashboard/presentations/harshEvents/",

                /**
                 *  @constant
                 *  @default
                 */
                "DRIVINGLOCATION": appPath + "modules/dashboard/presentations/drivingLocation/",

                /**
                 *  @constant
                 *  @default
                 */
                "CONTENT": appPath + "modules/dashboard/content/",

                /**
                 *  @constant
                 *  @default
                 */
                "FAQ": appPath + "modules/dashboard/content/faq/",

                /**
                 *  @constant
                 *  @default
                 */
                "INFO": appPath + "modules/dashboard/content/info/",

                /**
                 *  @constant
                 *  @default
                 */
                "HISTORY": appPath + "modules/dashboard/history/",

                /**
                 *  @constant
                 *  @default
                 */
                "TIPS": appPath + "modules/dashboard/content/tips/"
            };

        })())

        .constant("EVENTS", (function(){
            return {
                /**
                 *  @constant
                 *  @default
                 */
                "EVENT_USER_ADDED": "user_added"
            };
        })())

        .constant('DURATIONS', (function(){
            return {
                /**
                 *  @constant
                 *  @default
                 */
                "FAKE_RESPONSE_DURATION": 3000,

                /**
                 *  @constant
                 *  @default
                 */
                "PACED_DURATION": 1500,
                "QUICK_DURATION": 250
            };
        })())

        .constant('STUB', (function(){

            return {
                "PERMISSIONS": [
                    'summary',
                    'mileage',
                    'harshEvents',
                    'timeUse',
                    'typeRoad',
                    'speed',
                    'co2',
                    'drivingLocation'
                ],
                "CONTENT": [
                    "faq",
                    "info",
                    "tips",
                    "history"
                ],
                "SESSION": {
                    "token": "e120b94b-9c86-4ba0-b482-bd1e14546925",
                    "user": {
                        "username": "johndoe",
                        "firstName": "App",
                        "lastName": "lication",
                        "email": "application@imetrik.com",
                        "shippingAddressId": 50,
                        "homePhoneNumber": "123-123-1234",
                        "language": "FR",
                        "insuredId": "12345"
                    }
                },

                "DATE": "2014-01-08 05:24:05",

                "SUMMARY": {
                    "gradeByCriteria": [
                        {
                            "key": 2
                        }
                    ],
                    "timeOfUse": {
                        "name": "road",
                        "value": 49
                    },
                    "roadTypeUsage": {
                        "name": "roadtype",
                        "value": 20
                    },
                    "co2": 2,
                    "grade": 1,
                    "drivingLocationUsage": {
                        "name": "asdasd",
                        "value": 2
                    },
                    "sinceBeginningGrade": 2,
                    "averageSpeed": 40,
                    "gradeForLast30Day": [2],
                    "harshEvent": {
                        "braking": 1,
                        "acceleration": 2
                    },
                    "mileage": 18822
                },

                "SPEED": {
                    "periods": [
                        {
                            "key": {
                                "speed": 20,
                                "mileage": 20,
                                "grade": 2
                            }
                        }
                    ],
                    "summary": {
                        "grade": 1,
                        "averageSpeed": 40
                    }
                },

                "SPEED_AVERAGE": {
                    "selectedTimeFramePerPeriod": [
                        0
                    ],
                    "sinceBeginningPerPeriod": [
                        0
                    ]
                },

                "MILEAGE": {
                    "summary": {
                        "mileage": 2,
                        "grade": 1
                    },
                    "mileage": [
                        {
                            "key": {
                                "mileage": 2,
                                "grade": 1
                            }
                        }
                    ]
                },

                "MILEAGE_AVERAGE": {
                    "selectedTimeFramePerPeriod": [
                        2
                    ],
                    "sinceBeginningPerPeriod": [
                        1
                    ]
                },

                "MACHINE": {
                    "device": null,
                    "machine": {
                        "identifier": "APPMUBI",
                        "description": "Vehicle",
                        "firstConnectionDateTime": "2014-01-08 05:24:05",
                        "lastConnectionDateTime": "2014-01-10 08:14:19"
                    },
                    "vehicle": {
                        "id": 1,
                        "name": "Titine TOTO1",
                        "description": "Vehicle",
                        "year": 2013,
                        "brand": "Scion",
                        "model": "xB",
                        "mileage": 13000,
                        "doors": 5,
                        "color": "RED",
                        "fuelType": "GASOLINE",
                        "steerWheelSide": "LEFT",
                        "engineSize": "Big",
                        "genre": "SEDAN",
                        "pictureURL": "http://176.31.246.31/ux/UBI/images/car/red.png",
                        "gearbox": "AUTOMATIC"
                    }
                },

                "HARSH_EVENTS": {
                    "summary": {
                        "accelerationGrade": 0,
                        "brakingGrade": 0,
                        "accelerationPer100KM": 0,
                        "brakingPer100KM": 0
                    },
                    "events": [
                        {
                            "key": {
                                "brakingCount": 0,
                                "acceleration": [
                                    {
                                        "date": {
                                            "dayOfWeek": "",
                                            "hour": 0,
                                            "month": "",
                                            "year": 0,
                                            "dayOfMonth": 0,
                                            "dayOfYear": 0,
                                            "monthValue": 0,
                                            "nano": 0,
                                            "chronology": {
                                                "calendarType": "",
                                                "id": ""
                                            },
                                            "minute": 0,
                                            "second": 0
                                        },
                                        "intensity": 0,
                                        "duration": 0,
                                        "latitude": 0,
                                        "longitude": 0,
                                        "initialSpeed": 0
                                    }
                                ],
                                "accelerationGrade": 0,
                                "braking": [
                                    {
                                        "date": {
                                            "dayOfWeek": "",
                                            "hour": 0,
                                            "month": "",
                                            "year": 0,
                                            "dayOfMonth": 0,
                                            "dayOfYear": 0,
                                            "monthValue": 0,
                                            "nano": 0,
                                            "chronology": {
                                                "calendarType": "",
                                                "id": ""
                                            },
                                            "minute": 0,
                                            "second": 0
                                        },
                                        "intensity": 0,
                                        "duration": 0,
                                        "latitude": 0,
                                        "longitude": 0,
                                        "initialSpeed": 0
                                    }
                                ],
                                "accelerationCount": 0,
                                "mileage": 0,
                                "brakingGrade": 0,
                                "accelerationPer100KM": 0,
                                "brakingPer100KM": 0
                            }
                        }
                    ]
                },
                "HARSH_EVENTS_AVERAGE": {
                    "selectedTimeFramePerPeriod": {
                        "braking": [
                            0
                        ],
                        "acceleration": [
                            0
                        ]
                    },
                    "sinceBeginningPerPeriod": {
                        "braking": [
                            0
                        ],
                        "acceleration": [
                            0
                        ]
                    }
                },
                "CO2": {
                    "periods": {
                        "2015-03-03": {"grade": 1, "amount": 140.9, "mileage": 38, "ratio": 3.7},
                        "2015-03-04": {"grade": 5, "amount": 374.5, "mileage": 14, "ratio": 26.7},
                        "2015-03-05": {"grade": 1, "amount": 130.4, "mileage": 161, "ratio": 0.8},
                        "2015-03-06": {"grade": 6, "amount": 135.2, "mileage": 185, "ratio": 0.7},
                        "2015-03-07": {"grade": 2, "amount": 121.4, "mileage": 100, "ratio": 1.2},
                        "2015-03-08": {"grade": 9, "amount": 128.2, "mileage": 76, "ratio": 1.7},
                        "2015-03-09": {"grade": 6, "amount": 145.1, "mileage": 40, "ratio": 3.6},
                        "2015-03-10": {"grade": 6, "amount": 145.4, "mileage": 14, "ratio": 10.4},
                        "2015-03-11": {"grade": 2, "amount": 131.2, "mileage": 57, "ratio": 2.3},
                        "2015-03-12": {"grade": 1, "amount": 140.3, "mileage": 45, "ratio": 3.1},
                        "2015-03-13": {"grade": 4, "amount": 133.2, "mileage": 100, "ratio": 1.3},
                        "2015-03-14": {"grade": 5, "amount": 124.2, "mileage": 66, "ratio": 1.9},
                        "2015-03-15": {"grade": 4, "amount": 133.9, "mileage": 121, "ratio": 1.1},
                        "2015-03-16": {"grade": 1, "amount": 140.3, "mileage": 37, "ratio": 3.8},
                        "2015-03-17": {"grade": 2, "amount": 151.1, "mileage": 17, "ratio": 8.9},
                        "2015-03-18": {"grade": 4, "amount": 143.6, "mileage": 12, "ratio": 12}
                    },
                    "summary":{
                        "amountPerKM":2.5,"grade":5}
                },
                "CO2_AVERAGE": {
                    "selectedTimeFramePerPeriod": [
                        0
                    ],
                    "sinceBeginningPerPeriod": [
                        0
                    ]
                },
                "TIME_USE": {
                    "periods":{
                        "2015-06-11":{
                            "grade":1,
                            "usage":{
                                "MORNING":7,
                                "AFTERNOON":28,
                                "EVENING":64,
                                "NIGHT":0
                            }
                        }
                    },
                    "summary":{
                        "grade":1,
                        "usage":{
                            "MORNING":7,
                            "AFTERNOON":28,
                            "EVENING":64,
                            "NIGHT":0
                        }
                    }
                },
                "TIME_USE_AVERAGE": {
                    "sinceBeginning": [
                        {
                            "key": 0
                        }
                    ],
                    "selectedTimeFrame": [
                        {
                            "key": 0
                        }
                    ]
                },
                "TYPE_ROAD": {
                    "periods":{
                        "2015-06-03":{
                            "usage":{
                                "HIGHWAY":0,
                                "TRUNK_ROADS":0,
                                "COUNTRY_ROADS":0,
                                "CITY_STREETS":85,
                                "RESIDENTIAL_STREETS_AND_OTHER":14
                            },
                            "grade":1
                        }
                    },
                    "summary":{
                        "grade":1,
                        "usage":{
                            "RESIDENTIAL_STREETS_AND_OTHER":14,
                            "HIGHWAY":0,
                            "TRUNK_ROADS":0,
                            "CITY_STREETS":86,
                            "COUNTRY_ROADS":0
                        }
                    }
                },
                "TYPE_ROAD_AVERAGE": {
                    "sinceBeginning": [
                        {
                            "key": 0
                        }
                    ],
                    "selectedTimeFrame": [
                        {
                            "key": 0
                        }
                    ]
                },
                "DRIVING_LOCATION": {
                    "periods":{
                        "2015-06-04":{
                            "grade":4,
                            "usage":{
                                "RURAL":58,
                                "URBAN":42
                            }
                        }
                    },
                    "drivingLocationSummary":{
                        "grade":6,
                        "usage":{
                            "URBAN":42,
                            "RURAL":58
                        }
                    }
                },
                "DRIVING_LOCATION_AVERAGE": {
                    "sinceBeginning": [
                        {
                            "key": 0
                        }
                    ],
                    "selectedTimeFrame": [
                        {
                            "key": 0
                        }
                    ]
                }
            };
        })());
})();