/*jshint -W099*/

/**
 * iMetric
 * @module user
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    /**
     * Setup of User Module
     *
     */

    /**
     * @constructor module
     * @memberOf module:user
     */
    var UserModule = angular.module('UBIDriver.modules.user',[
        'UBIDriver.modules.user.controllers',
        'UBIDriver.modules.user.services'
    ])

    .config(['$stateProvider',
             '$httpProvider',
             '$urlRouterProvider',
             'PATHS',
             'localStorageServiceProvider',
             function($stateProvider,
                      $httpProvider,
                      $urlRouterProvider,
                      PATHS,
                      localStorageServiceProvider) {

         $stateProvider
         .state('user', {
             url: '',
             views: {
                 'main': {
                     templateUrl: PATHS.USER + 'user.view.html',
                     controller: 'UserController as user'
                 }
             }
         })
         .state('user.login', {
             url: '/login',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-login.view.html',
                     controller: 'UserLoginController as userLogin'
                 }
             }
         })
         .state('user.loggedin', {
             url: '/login',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-loggedin.view.html',
                     controller: 'UserLoggedInController as userLoggedIn'
                 }
             }
         })
         .state('user.forgot', {
             url: '/forgot',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-forgot.view.html'
                 }
             }
         })
         .state('user.subscribe', {
             url: '/subscribe',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-subscribe.view.html'
                 }
             }
         })
         .state('user.subscribe.personal', {
             url: '/subscribe/personal',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-subscribe.view.html'
                 }
             }
         })
         .state('user.subscribe.shipping', {
             url: '/subscribe/shipping',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-subscribe.view.html'
                 }
             }
         })
         .state('user.subscribe.vehicle', {
             url: '/subscribe/vehicle',
             views: {
                 'userComponent@user': {
                     templateUrl: PATHS.USER + 'user-subscribe.view.html'
                 }
             }
         });
    }]);
})();