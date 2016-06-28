/*jshint -W099*/
/**
 * iMetric
 * @module user/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var UserControllers = angular.module('UBIDriver.modules.user.controllers', [])

    /**
     * @constructor UserController
     * @memberOf module:user/controllers
     */
    .controller("UserController", ["$scope",
                                   "$rootScope",
                                   "$state",
                                   "PATHS",
                                   function($scope,
                                            $rootScope,
                                            $state,
                                            PATHS){


    }])

    /**
     * @constructor UserLoginController
     * @memberOf module:user/controllers
     */
    .controller("UserLoginController", ["$scope",
                                        "$rootScope",
                                        "$state",
                                        "$timeout",
                                        "$window",
                                        "PATHS",
                                        "STUB",
                                        "UserService",
                                        "UserAuthService",
                                        "DashboardStateService",
                                        "localStorageService",
                                        function($scope,
                                                 $rootScope,
                                                 $state,
                                                 $timeout,
                                                 $window,
                                                 PATHS,
                                                 STUB,
                                                 UserService,
                                                 UserAuthService,
                                                 DashboardStateService,
                                                 localStorageService){

        /**
         * @name userModel
         * @author Alex Boisselle
         * @type {object}
         * @memberOf module:user/controllers.UserLoginController
         * @description user module user view model
         */
        $scope.userModel = $rootScope.userModel = {};

        /**
         * @function loginSubmitHandler
         * @author Alex Boisselle
         * @memberOf module:user/controllers.UserLoginController
         * @description login button click handler, authenticates with server and generates states based on response
         * @fires UserAuthService.authenticate
         * @fires UserService.getUser
         * @fires DashboardStateService.generateStates
         */
        $scope.loginSubmitHandler = function() {

            $scope.state = "logging in";
            $rootScope.noData = false;
            $rootScope.noDevice = false;

            UserAuthService.authenticate($scope.username, $scope.password, $scope.remember).then(function (authUser) {

                $scope.state = "logged in";

                UserService.getUser().then(function(user) {

                    $scope.userModel = user;
                    $scope.state = "got perms, generate menu then go to dashboard";

                    DashboardStateService.generateStates(user.permissions);

                    angular.element(document.querySelector('body')).removeClass('login');

                    $state.go('dashboard');

                }, function (error) {
                    failToLogin();
                });

            }, function (error) {

                switch(error){
                    case 503:
                        angular.element(document.querySelector('.login-failed.failed-service')).addClass('active');
                        break;
                    default:
                        angular.element(document.querySelector('.login-failed.failed-creds')).addClass('active');
                        break;
                }

                angular.element(document.querySelector('#username, #username input')).addClass('md-input-invalid');
                angular.element(document.querySelector('#password, #password input')).addClass('md-input-invalid');
            });
        };

        /**
         * @function selectLangHandler
         * @author Alex Boisselle
         * @memberOf module:user/controllers.UserLoginController
         * @description language button handler, sets local storage and reloads app
         * @fires localStorageService.set
         * @fires $window.location.reload
         */
        $scope.selectLangHandler = function(lang) {

            $rootScope.currentLang = lang;
            localStorageService.set('currentLang', lang);

            $timeout(function(){
                $window.location.reload();
            });
        };

        /**
         * @function failToLogin
         * @author Alex Boisselle
         * @memberOf module:user/controllers.UserController
         * @description executes if the login process fails
         * @fires UserController.toggleBodyClasses
         */
        function failToLogin(){
            toggleBodyClasses(true);
            $state.go('user.login');
        }

        /**
         * @function toggleBodyClasses
         * @author Alex Boisselle
         * @memberOf module:user/controllers.UserController
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
    }])

    .controller("UserProfileController", ["$scope",
                                          "$rootScope",
                                          "$state",
                                          "PATHS",
                                          "UserService",
                                          function($scope,
                                                   $rootScope,
                                                   $state,
                                                   PATHS,
                                                   UserService){

        $scope.participant = UserService.participant;

        console.log($scope.participant);

        //cleans birthday so that calendar input can properly read it
        $scope.participant.user.birthDate = new Date($scope.participant.user.birthDate);

        UserService.getUserAddresses().then(function(data){
            $scope.addresses = data;
        });

        $scope.enableForm = function(title){

            $scope.userClone = angular.copy($scope.user);
            $scope.addressClone = angular.copy($scope.addresses[0]);

            var targetFormInputs = $('.' + title + '-form input'),
                targetFormPickers = $('.' + title + '-form md-datepicker'),
                targetFormDropdowns = $('.' + title + '-form md-select');

            targetFormInputs.prop('disabled', false);
            targetFormPickers.prop('disabled', false);
            targetFormDropdowns.prop('disabled', false);

            $('#update-' + title).css('display', 'none');
            $('#cancel-' + title).css('display', 'block');
            $('#submit-' + title).css('display', 'block');

        };

        $scope.disableForm = function(title, reset){
            var targetFormInputs = $('.' + title + '-form input'),
                targetFormPickers = $('.' + title + '-form md-datepicker'),
                targetFormDropdowns = $('.' + title + '-form md-select');

            targetFormInputs.prop('disabled', true);
            targetFormPickers.prop('disabled', true);
            targetFormDropdowns.prop('disabled', true);

            $('#update-' + title).css('display', 'block');
            $('#cancel-' + title).css('display', 'none');
            $('#submit-' + title).css('display', 'none');

            $('#update-' + title).prop('disabled', false);

            if(reset){
                $scope.participant = angular.copy($scope.userClone);
                $scope.addresses[0] = angular.copy($scope.addressClone);
            }
        };

        $scope.saveProfileForm = function(){

            //must clean user object for PUT request
            var userObj = angular.copy($scope.participant);
            delete userObj.user.permissions;

            userObj.user.birthDate = moment($scope.participant.user.birthDate).format('YYYY-MM-DD');

            delete userObj.user.birthDate;

            UserService.setUser(userObj).then(function(){

                $scope.disableForm('profil');
            }, function(){
                //TODO: handle save error
            });
        };

        $scope.saveAddressForm = function(){

            var create = false;

            //$scope.addresses[0].name = "shipping";
            $scope.addresses[0].country = "France";

            //must clean user object for PUT request
            var addressObj = $scope.addresses[0],
                addressId = $scope.addresses[0].name;

            UserService.setUserAddress(addressObj, addressId).then(function(){

                $scope.disableForm('adresse');
            }, function(){
                //TODO: handle save error
            });

        };

        $scope.saveVehicleName = function(vehicle, index){

            var vehicleOldName = vehicle.oldName;

            UserService.setVehicle(vehicle, vehicleOldName).then(function(){

                $scope.vehicles[index].title            = vehicle.name; //for displaying in html
                $scope.vehicles[index].vehicle.oldName  = vehicle.name; //for injecting into api call
                $scope.vehicles[index].vehicle.name     = vehicle.name; //for displaying in dropdown

                $scope.toggleNicknameField(index);
            }, function(){
                //TODO: handle save error
            });
        };

        $scope.toggleNicknameField = function(index, reset){
            if($('.car-name-' + index).hasClass('active')){

                $scope.oldCarName = angular.copy($scope.vehicles[index].vehicle.name);

                $('.car-name-' + index).removeClass('active');
                $('.car-nickname-' + index).addClass('active');
            } else {

                if (reset) {
                    $scope.vehicles[index].vehicle.name = angular.copy($scope.oldCarName);
                }

                $('.car-name-' + index).addClass('active');
                $('.car-nickname-' + index).removeClass('active');
            }
        };

        $scope.date = new Date();
    }]);
})();