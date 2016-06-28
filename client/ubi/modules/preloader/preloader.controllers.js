/*jshint -W099*/
/**
 * iMetric
 * @module preloader/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var PreloaderControllers = angular.module('UBIDriver.modules.preloader.controllers', [])

    /**
     * @constructor PreloaderController
     * @memberOf module:preloader/controllers
     */
    .controller("PreloaderController", [ "$scope",
                                         "$rootScope",
                                         "$state",
                                         "$timeout",
                                         "$location",
                                         "localStorageService",
                                         "UserService",
                                         "UserAuthService",
                                         "PreloaderService",
                                         "DashboardStateService",
                                         "DURATIONS",
                                         "CONFIG",
                                         "PATHS",
                                         function($scope,
                                                  $rootScope,
                                                  $state,
                                                  $timeout,
                                                  $location,
                                                  localStorageService,
                                                  UserService,
                                                  UserAuthService,
                                                  PreloaderService,
                                                  DashboardStateService,
                                                  DURATIONS,
                                                  CONFIG,
                                                  PATHS){

       /**
        * @name preloading
        * @author Alex Boisselle
        * @type {boolean}
        * @memberOf module:preloader/controllers.PreloaderController
        * @description preloading flag for ng-show on intro preloader bar
        * @example
        * <div class="progress" ng-show="preloading">
        *   <div class="line">&nbsp;</div>
        *   <div class="bar">&nbsp;</div>
        *</div>
        */
        $scope.preloading = false;

        angular.element(document.querySelector('body')).addClass('preloader');

        PreloaderService.getLanguageFile().then(function(data){

            $rootScope.LANG = data;

            //if token & username are in the params, set the cookie for them and then move forward
            if($location.search().username && $location.search().token){
                UserAuthService.setSession($location.search().token, "refreshToken", $location.search().username, true);
            }

            //if token, try to log user in
            if(localStorageService.get(CONFIG.TOKEN.REMEMBER) && UserAuthService.getSession()){

                $scope.preloading = true;

                //try successfully getUser using token
                UserService.getUser().then(function(user){

                    //token is good, generate states and head to summary
                    DashboardStateService.generateStates(user.permissions);

                    //simulates load time
                    $timeout(function(){

                        toggleBodyClasses();

                        $state.go('dashboard');

                    }, DURATIONS.PACED_DURATION);

                }, function(){

                    //token is bad, go to login
                    failToLogin();

                });
            } else {
                //no token found, go to login

                //wait time showing logo
                $timeout(function(){

                    failToLogin();

                }, DURATIONS.PACED_DURATION);
            }
        });

       /**
        * @function failToLogin
        * @author Alex Boisselle
        * @memberOf module:preloader/controllers.PreloaderController
        * @description executes if the login process fails
        * @fires PreloaderController.toggleBodyClasses
        */
        function failToLogin(){
            toggleBodyClasses(true);
            $state.go('user.login');
        }

       /**
        * @function toggleBodyClasses
        * @author Alex Boisselle
        * @memberOf module:preloader/controllers.PreloaderController
        * @description changes classes of preloader and intro to execute css3 anims
        */
        function toggleBodyClasses(login){
            angular.element(document.querySelector('.preloader .logo')).addClass('loaded');
            angular.element(document.querySelector('body')).removeClass('preloader');
            angular.element(document.querySelector('body')).addClass('dashboard');

           if(login){
               angular.element(document.querySelector('body')).addClass('login');
           }
        }
    }]);
})();