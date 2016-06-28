/*jshint -W099*/
/**
 * iMetric
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var DashboardDirectives = angular.module('UBIDriver.modules.dashboard.directives', [])

    /**
     * @constructor DashboardDirectives
     * @memberOf module:dashboard/directives
     */
    .directive("scroll", ["$window", function ($window) {

        var dir = {
            scope: {
                scroll: "="
            },
            link: function (scope, element, attrs) {
                $(window).on("scroll", function () {

                    if(!device.mobile()){

                        //console.log($('body').scrollTop() + " > " + attrs.scroll);

                        if ($('body').scrollTop() > attrs.scroll) {
                            //console.log("ADD IT");

                            element.addClass('scroll');
                            //console.log('Scrolled below header.');
                        } else {
                            element.removeClass('scroll');
                            //console.log('Header is in view.');
                        }
                    }
                });
            }
        };

        return dir;
    }])

    .directive("forceFixedPosition", ["$window", function ($window) {

        //var origTop;

        var dir = {
            link: function (scope, element, attrs) {
                if(device.mobile()){
                    //origTop = element.css('top').replace(' px', '');

                    angular.element(document.querySelector('#body')).bind("scroll", function () {

                        element.css('top', (($("#main").position().top * -1) + origTop) + 'px');
                    });
                }
            }
        };

        return dir;
    }])

    .directive('dropdown', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var target = angular.element(document.querySelector("#" + attrs.dropdown.split(',')[0])),
                    targetChildren = angular.element(target).find('a'),
                    _class = attrs.dropdown.split(',')[1];

                element.bind('click', function(e) {

                    e.stopPropagation();

                    target.toggleClass(_class);

                    if(!$('body').hasClass('dropdown')){

                        open(target, _class);

                    } else {
                        close(target, _class);
                    }
                });

                angular.forEach(targetChildren, function(value, keys){

                    angular.element(value).bind('click', function(e){

                        e.stopPropagation();

                        close(target, _class);
                    });
                });
            }
        };

        function close(target, _class){

            $(target).removeClass(_class);

            $('body').removeClass('dropdown');
            $('body').unbind('click');
        }

        function open(target, _class){

            $(target).addClass(_class);

            $('body').addClass('dropdown');
            $('body').click(function(){

                close(target, _class);
            });
        }
    }])

    .directive('debug', ['PATHS', 'UserAuthService', 'UserService', function(PATHS, UserAuthService, UserService) {
        return {
            restrict: 'E',
            templateUrl: PATHS.DASHBOARD + '/debug.view.html',
            link: function(scope, element, attrs) {

            },
            controller: ['$scope', function($scope){
                $scope.refresh = function(){
                    $scope.user = UserService.user.username;
                    $scope.token = UserAuthService.getToken();
                    $scope.refreshToken = UserAuthService.getRefreshToken();
                };

                $scope.refresh();
            }]
        };
    }])

    .directive('popup', ['PATHS', 'DashboardService', 'UserService', '$sce', '$timeout', function(PATHS, DashboardService, UserService, $sce, $timeout) {
        return {
            restrict: 'E',
            templateUrl: PATHS.DASHBOARD + '/dashpopup.view.html',
            controller: ['$scope', function($scope){

                $scope.lessonHTML = "";
                this.name = "popupCtrl";

                var self = this;

                $scope.init = function(id, skip){

                    $scope.user = UserService.user;
                    self.open();

                    if(id){
                        getLessonContent(id, skip);
                    } else {
                        getLessonID();
                    }
                };

                function getLessonID() {
                    DashboardService.getLessonID().then(function(id){
                        getLessonContent(id);
                    }, function(){
                        alert('There is no lesson for this user.');

                        self.close();
                    });
                }

                function getLessonContent(id, skip){
                    DashboardService.getLessonContent(id).then(function(html){

                        $scope.popupID = id;

                        $('.popup-content-container').removeClass('loading');

                        setContent(html);
                        $scope.closeCtrl.init(id, skip);

                    }, function(){

                        alert('There is no content for Lesson ' + id);
                        self.close();
                    });
                }

                function setContent(html){
                    $scope.popupContent = html;
                }

                this.register = function(controller) {
                    $scope[controller.name] = controller;
                };

                this.open = function(){
                    $scope.popupContent = "";


                    $('.popup-overlay').css('display', 'block');
                    $('.popup-overlay').addClass('active');

                    //$('#main').addClass('blur5');
                    //$('.vertical-bar').addClass('blur5');

                    $('.popup-content-container').css('display', 'block');
                    $('.popup-content-container').animate({scrollTop: 0}, 0);
                    $('.popup-content-container').addClass('active loading');
                    $('body').css('overflow-y', 'hidden');
                };

                this.close = function(){
                    $('.popup-overlay').removeClass('active');
                    $('.popup-content-container').removeClass('active');

                    $timeout(function(){
                        $('.popup-overlay').css('display', 'none');
                        $('.popup-content-container').css('display', 'none');
                    }, 200);

                    //$('#main').removeClass('blur5');
                    //$('.vertical-bar').removeClass('blur5');
                    $('body').css('overflow-y', 'scroll');

                    $timeout(function(){
                        $scope.popupContent = "";
                    }, 200);
                };

                $scope.close = function(){
                    if($scope.closeCtrl.viewed){
                        self.close();
                    }
                }
            }]
        };
    }])

    .directive('popupContent', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.popupContent, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }])

    .directive('popupClose', ['PATHS', '$timeout', '$interval', function(PATHS, $timeout, $interval) {
        return {
            require: ['popupClose', '^popup'],
            template: "<div class='close-text'>{{closeText}}</div><div class='close-loading'></div>",
            controller: ['$rootScope', '$scope', '$element', function($rootScope, $scope, $element){

                this.name = "closeCtrl";
                this.viewed = false;

                var self = this;

                this.init = function(id, skip){

                    if(skip) this.viewed = true;

                    if(this.viewed){
                        enableButton();
                    } else {
                        disableButton();
                        startTimer();
                    }
                };

                function startTimer(){
                    var int = $interval(function(){

                        if($scope.closeCounter > 0){

                            $scope.closeCounter--;
                            $scope.closeText = "Fermer dans " + $scope.closeCounter + " secondes";

                        } else {

                            $interval.cancel(int);

                            self.viewed = true;

                            enableButton();

                        }
                    }, 1000);
                }

                function disableButton() {
                    $scope.closeCounter = 10;
                    $scope.closeText = "Fermer dans " + $scope.closeCounter + " secondes";

                    $element.addClass('loading');
                }

                function enableButton() {
                    $scope.closeCounter = "";
                    $scope.closeText = "Fermer";

                    $element.addClass('ready');
                }
            }],
            link: function(scope, element, attrs, controllers){

                var closeCtrl = controllers[0],
                    popupCtrl = controllers[1];

                popupCtrl.register(closeCtrl);

                element.bind('click', function(){
                    if(closeCtrl.viewed){
                        popupCtrl.close();
                    }
                });
            }
        };
    }])

    .directive('grade', ['PATHS', 'UserAuthService', 'UserService', function(PATHS, UserAuthService, UserService) {
        return {
            restrict: 'E',
            replace: true,
            require: 'grade',
            template: '<div class="note {{gradeClass}}">{{grade}}</div>',
            link: function(scope, element, attrs, ctrl) {
                var discipline = attrs.discipline,
                    type = attrs.type,
                    gradeNum;

                if(attrs.grade){

                    scope.grade = attrs.grade;
                    scope.gradeClass = UserService.cleanGrade(scope.grade).toLowerCase();

                } else {

                    if(!discipline || discipline.length == 0 ){

                        attrs.$observe('discipline', function(data) {

                            if(data){
                                gradeNum = UserService.getGrade(data);

                                scope.grade = ctrl.root.LANG.GRADE[gradeNum];
                                scope.gradeClass = UserService.cleanGrade(scope.grade).toLowerCase();
                            }
                        }, true);

                    } else {
                        gradeNum = UserService.getGrade(discipline);

                        scope.grade = ctrl.root.LANG.GRADE[gradeNum];
                        scope.gradeClass = UserService.cleanGrade(scope.grade).toLowerCase();
                    }
                }


            },
            controller: ["$rootScope", function($rootScope){
                this.root = $rootScope;
            }]
        };
    }])

    .directive('ubiHeader', ['PATHS', function(PATHS) {
        return {
            restrict: 'E',
            templateUrl: PATHS.DASHBOARD + '/dashheader.view.html',
            link: function(scope, element, attrs) {

            }
        };
    }])

    .directive('noDataInstruction', ['PATHS', function(PATHS) {
        return {
            restrict: 'E',
            templateUrl: PATHS.DASHBOARD + '/dashnodata.view.html',
            link: function(scope, element, attrs) {

            }
        };
    }])

    .directive('toggleClass', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {

                    var target = angular.element(document.querySelector("#" + attrs.toggleClass.split(',')[0])),
                        _class = attrs.toggleClass.split(',')[1];

                    target.toggleClass(_class);
                });
            }
        };
    }])

    .directive('disabledHard', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(function() {
                    return element.attr('disabled');
                }, function(newValue){
                    element.attr('disabled', true);
                });
            }
        };
    }]);
})();