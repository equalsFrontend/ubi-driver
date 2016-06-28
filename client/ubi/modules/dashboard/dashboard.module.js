/*jshint -W099*/

/**
 * iMetric
 * @module dashboard
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    /**
     * @constructor module
     * @memberOf module:dashboard
     */
    var DashboardModule = angular.module('UBIDriver.modules.dashboard',[
        'UBIDriver.modules.history',
        'UBIDriver.modules.dashboard.controllers',
        'UBIDriver.modules.dashboard.services',
        'UBIDriver.modules.dashboard.directives',
        'UBIDriver.modules.dashboard.presentations.mileage',
        'UBIDriver.modules.dashboard.presentations.speed',
        'UBIDriver.modules.dashboard.presentations.summary',
        'UBIDriver.modules.dashboard.presentations.timeUse',
        'UBIDriver.modules.dashboard.presentations.drivingLocation',
        'UBIDriver.modules.dashboard.presentations.co2',
        'UBIDriver.modules.dashboard.presentations.typeRoad',
        'UBIDriver.modules.dashboard.presentations.harshEvents'
    ])

    /**
     * @function $dashboardStateProvider
     * @author Alex Boisselle
     * @memberOf module:dashboard.module
     * @description sets up a provider that exposes the config block $stateProvider class during the run block
     * @returns {object} addState - function that adds a state dynamically during run block
     */
    .provider('$dashboardStateProvider', ['$stateProvider', function($stateProvider){
        this.$get = ['PATHS', '$state', function(PATHS, $state){
            return {
                /**
                 * @function addState
                 * @memberOf module:dashboard.module
                 * @param {string} title - the title used to build state, url & find template
                 * @param {boolean} controllerAs - set a controller to the state or not (should generate ExampleController as example)
                 * @author Alex Boisselle
                 * @description adds states to the dashboards state provider dynamically by making stateProvider configuration available in run block
                 */
                addState: function(title, controllerAs) {

                    var states = $state.get(),
                        exists = false;

                    for(var s in states){
                        var state = states[s];

                        if('dashboard.' + title == state.name){
                            exists = true;
                        }
                    }

                    if(!exists) {
                        var templateUrl = PATHS[title.toUpperCase()] + '/' + title + '.view.html',
                            controller = controllerAs ? (title.charAt(0).toUpperCase() + title.slice(1)) + "Controller as " + title : null;

                        $stateProvider.state('dashboard.' + title, {
                            url: '/' + title,
                            views: {
                                'dashboardModule@dashboard': {
                                    templateUrl: templateUrl,
                                    controller: controller
                                }
                            }
                        });
                    }
                }
            };
        }];
    }])

    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'PATHS', function($stateProvider, $urlRouterProvider, $httpProvider, PATHS) {

        $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            views: {
                'main': {
                    templateUrl: PATHS.DASHBOARD + 'dashboard.view.html',
                    controller: 'DashboardController as dashboard'
                }
            }
        })
        .state('dashboard.profile', {
            url: '/profile',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.USER + 'user-profile.view.html',
                    controller: 'UserProfileController as userProfile'
                }
            }
        });

        /* HARDCODED STATES

        $stateProvider
        .state('dashboard.info', {
            url: '/info',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.INFO + 'info.view.html'
                }
            }
        })
        .state('dashboard.faq', {
            url: '/faq',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.FAQ + 'faq.view.html'
                }
            }
        })
        .state('dashboard.mileage', {
            url: '/mileage',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.MILEAGE + 'mileage.view.html',
                    controller: 'MileageController as mileage'
                }
            }
        })
        .state('dashboard.speed', {
            url: '/speed',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.SPEED + 'speed.view.html',
                    controller: 'SpeedController as speed'
                }
            }
        })
        .state('dashboard.summary', {
            url: '/summary',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.SUMMARY + 'summary.view.html',
                    controller: 'SummaryController as summary'
                }
            }
        })
        .state('dashboard.profile', {
            url: '/profile',
            views: {
                'dashboardModule@dashboard': {
                    templateUrl: PATHS.USER + 'profile.view.html',
                    controller: 'ProfileController as userProfile'
                }
            }
        });
        */
    }])
    .filter('offset', function() {
        return function(input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    })
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
    .filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function(a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();

            return filtered;
        };
    });
})();