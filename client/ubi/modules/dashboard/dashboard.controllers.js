/*jshint -W099*/
/**
 * iMetric
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var DashboardControllers = angular.module('UBIDriver.modules.dashboard.controllers', [])

    /**
     * @constructor DashboardController
     * @memberOf module:dashboard/controllers
     */
    .controller("DashboardController", ["$scope",
                                        "$rootScope",
                                        "$state",
                                        "$timeout",
                                        "DashboardService",
                                        "UserAuthService",
                                        "ngDialog",
                                        function($scope,
                                                 $rootScope,
                                                 $state,
                                                 $timeout,
                                                 DashboardService,
                                                 UserAuthService,
                                                 ngDialog){

        $scope.menuVisible = false;
        $scope.currentRange = 'since_forever';
        $scope.isMobile = device.mobile();

        $scope.getMachines = function(){
            DashboardService.getMachines().then(function (data) {
                setMachines(data);

                if($scope.vehicles[0]){
                    setCurrentMachine($scope.vehicles[0]); //should go to current selected from cookie eventually
                    setDateByMachine($scope.vehicles[0]);
                } else {
                    $rootScope.noDevice = true;
                }

                $state.go('dashboard.summary');
            }, function () {
                //ngDialog.open({
                //    template: "testing",
                //    className: 'ngdialog-theme-default',
                //    scope: $scope,
                //    plain: true
                //});
                failToLogin();
            });
        };

        $scope.toggleUserPopup = function(){
            if($('.popup-user').hasClass('active')){
                $('.popup-user').removeClass('active');
            } else {
                $('.popup-user').addClass('active');
            }
        };

        $scope.menuToggleHandler = function(){
            if($scope.menuVisible){
                $scope.menuVisible = false;
                $timeout(function(){
                    $('.overlay').hide();
                }, 200);
            } else {
                $('.overlay').show();
                $scope.menuVisible = true;
            }
        };

        $scope.changeDate = function(startDate, endDate){
            setDateByPicker(startDate, endDate);

            $scope.refreshPresentation();
        };

        $scope.changeMachine = function($event){
            var el = angular.element($event.target),
                machine = JSON.parse(el[0].getAttribute('data-machine')),
                currentSection = $state.current.name;

            $('#car-dropdown').removeClass('active');

            setCurrentMachine(machine);
            setDateByMachine(machine);

            $scope.refreshPresentation();

            $rootScope.noDevice = false;

            $('.dropdown-menu .active').removeClass('active');
            $('body').removeClass('active');

            $('body').unbind('click');

            $scope.changeRange('since_forever', 100);

            //generateDatePicker();
        };

        $scope.refreshPresentation = function(){

            $rootScope.refreshing = true;

            var currentSection = $state.current.name;

            $state.go('dashboard');

            setTimeout(function(){
                $state.go(currentSection);
            }, 0);
        };

        $scope.cleanGrade = function(grade){
            if(grade){
                var clean = grade.replace(/\+/g,'');
                    clean = clean.replace(/\//g, '');
                return clean;
            }
        };

        $scope.scrollTo = function(top){

            var _top = top || 0;

            $('body').animate({
                scrollTop: _top
            });
        };

        $scope.showPage = function(page, reset, zoom){
            var pages = ['1', '2', '3'],
                indexToRemove = pages.indexOf(page);

                pages.splice(indexToRemove, 1);

            for (var x = 0; x < pages.length; x++){
                $('.page' + pages[x]).addClass("close");
                $('#p' + pages[x]).removeClass('active');
            }

            $('.page' + page).removeClass('close');
            $('#p' + page).addClass('active');

            $scope.scrollTo($('.page' + page).offset().top - 40);

            if(reset){
                $scope.$broadcast('resetMap');
            }
        };

        $scope.checkRange = function(range){
            var lastConnectionDate = moment($scope.currentMachine.lastConnectionTs.split(' ')[0]);

            switch(range){
                case 'since_forever':

                    if(lastConnectionDate) {
                        return true
                    } else {
                        return false;
                    }

                    break;
                case 'this_week':

                    var startOfWeek = moment().startOf('isoWeek');

                    if(lastConnectionDate.diff(startOfWeek) < 0){
                        return false;
                    } else {
                        return true;
                        //console.log("week true");
                    }

                    break;
                case 'this_month':

                    var startOfMonth = moment().startOf('month');

                    if(lastConnectionDate.diff(startOfMonth) < 0){
                        return false;
                    } else {
                        return true;
                        //console.log("month true");
                    }

                    break;
                case 'this_quarter':

                    var currentQuarter = moment().quarter(),
                        currentYear = new Date().getFullYear(),
                        firstMonth = 12 - 3 * ((4 - currentQuarter) + 1);

                    var startOfQuarter = moment(moment([currentYear, firstMonth]).startOf('month'));

                    if(lastConnectionDate.diff(startOfQuarter) < 0){
                        return false;
                    } else {
                        return true;
                        //console.log("quarter true");
                    }

                    break;
                case 'this_year':

                    var startOfyear = moment(new Date().getFullYear() + "-01-01");

                    if(lastConnectionDate.diff(startOfyear) < 0){
                        return false;
                    } else {
                        return true;
                        //console.log("year true");
                    }

                    break;
            }
        };

        $scope.changeRange = function(range, _delay, itemClicked){

            if(itemClicked){

                var isDisabled = $(itemClicked.currentTarget.parentElement).hasClass('disabled');

                if(isDisabled) return;
            }

            var startDate,
                endDate,
                delay = 0,
                lastConnectionDate = $scope.currentMachine.lastConnectionTs.split(' ')[0],
                today = new Date(),
                today = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) + "-" + (today.getDate() < 10 ? "0" + today.getDate() : today.getDate());

            if(_delay) delay = _delay;

            switch(range){
                case 'since_forever':

                    startDate = $scope.currentMachine.firstConnectionTs.split(' ')[0];

                    endDate = new Date();
                    endDate = lastConnectionDate;

                    break;
                case 'this_week':

                    startDate = new Date(moment().startOf('isoWeek'));
                    startDate = startDate.getFullYear() + "-" + ((startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1) + "-" + (startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate());

                    endDate = new Date();
                    endDate = lastConnectionDate;

                    break;
                case 'this_month':

                    startDate = new Date(moment().startOf('month'));
                    startDate = startDate.getFullYear() + "-" + ('0' + (startDate.getMonth()+1)).slice(-2) + "-0" + startDate.getDate();

                    endDate = new Date();
                    endDate = lastConnectionDate;

                    break;
                case 'this_quarter':

                    var currentQuarter = moment().quarter(),
                        currentYear = new Date().getFullYear(),
                        firstMonth = 12 - 3 * ((4 - currentQuarter) + 1),
                        endMonth = 3 * currentQuarter;

                    //console.log("currentQuarter = " + currentQuarter);
                    //console.log("firstMonth = " + firstMonth);
                    //console.log("endMonth = " + endMonth);

                    startDate = new Date(moment(moment([currentYear, firstMonth + 1]).startOf('month')));
                    startDate = startDate.getFullYear() + "-" + (startDate.getMonth() < 10 ? "0" + startDate.getMonth() : startDate.getMonth()) + "-0" + startDate.getDate();

                    endDate = new Date();
                    endDate = lastConnectionDate;

                    break;
                case 'this_year':

                    startDate = new Date().getFullYear() + "-01-01";
                    endDate = lastConnectionDate;

                    break;
            }

            $timeout(function(){
                $scope.changeDate(startDate, endDate);
                $scope.currentRange = range;
            }, delay);
        };

        $scope.checkAvailable = function(value, alt){
            if(value != null && value != undefined){
                return value;
            } else {
                return alt;
            }
        };

        $scope.firePopup = function(id, skip, delay){
            var el = angular.element(document.querySelector('popup')),
                _id = id ? id : false;

            if(delay){
                $timeout(function(){
                    el.scope().init(_id, skip);
                }, delay)
            } else {
                el.scope().init(_id, skip);
            }
        };

        $scope.closePopup = function(id){
            var el = angular.element(document.querySelector('popup'));

            el.scope().close();
        };

        $scope.debugLesson = function(id){
            var idToDebug = document.getElementById('lesson-debug-input').value;

            $scope.firePopup(idToDebug);
        };

        $scope.scrambleToken = function(){
            UserAuthService.scrambleToken();

            angular.element(document.getElementById('debug')).scope().refresh();
        };

        function generateMobileRangePicker(startDate, endDate){

            var oneDayMilli = 1 * 24 * 60 * 60 * 1000,
                startDate = new Date(startDate.full),
                startDateYearFix = startDate.toString().split(' ')[3]; //for some reason the date is messed up in 2013 so we just split the date here to grab the year

            //startDate.setTime(startDate.getTime() + oneDayMilli);

            endDate = new Date(endDate.full);
            //endDate.setTime(endDate.getTime() + oneDayMilli);

            $('#date-time-picker').mobiscroll().range({
                theme: 'maif-material',
                display: 'bottom',
                lang: 'fr',
                fromText: $rootScope.LANG.FROM,
                setText: $rootScope.LANG.SET,
                closeOnSelect: true,
                defaultValue: [startDate, endDate],
                //invalid: Imetrik.getInvalidDays({
                //    startDate: startDate,
                //    endDate: endDate
                //}, startDate.getMonth(), startDate.getYear()),
                onMarkupReady: function(html, inst) {
                    // 'html' is the jQuery object
                    // containing the generated html
                    //debugger;
                },
                onClose: function (range, button, inst) {
                    if (button == "set") {

                        var rangeArr = range.split(' - ');

                        var startArr = rangeArr[0].split('/'),
                            startYear = startArr[2],
                            startMonth = startArr[1],
                            startDay = startArr[0],
                            startStr = startYear + "-" + startMonth + "-" + startDay;

                        var endArr = rangeArr[1].split('/'),
                            endYear = endArr[2],
                            endMonth = endArr[1],
                            endDay = endArr[0],
                            endStr = endYear + "-" + endMonth + "-" + endDay;

                        $scope.changeDate(startStr, endStr);

                        $scope.currentRange = "custom_selection";

                        $scope.refreshPresentation();
                    }
                },
                onDayChange: function (day, inst) {

                },
                onMonthChange: function (year, month, inst) {

                    //summary.getCalendarDate(current_machine, year + '-' + (month + 1), function () {
                    //
                    //    inst.settings.invalid = Imetrik.getInvalidDays({
                    //        startDate: startDate,
                    //        endDate: endDate
                    //    }, month, year);
                    //
                    //    inst.refresh();
                    //
                    //});
                }
            });

            $('#date-time-picker').mobiscroll('setValues', [startDate]);
        }

        function generateMobileDatePicker(date){

            $('#date-time-picker').mobiscroll().calendar({
                theme: 'maif-material',
                display: 'bottom',
                lang: 'fr',
                closeOnSelect: true,
                //invalid: getInvalidDays({
                //    startDate: date,
                //    endDate: date
                //}, date.month, date.year),
                onDayChange: function (day, inst) {

                    var newDay = new Date(day.date),
                        newDayStr = newDay.getFullYear() + "-" + (((newDay.getMonth() + 1) < 10 ? "0" + (newDay.getMonth() + 1) : newDay.getMonth() + 1)) + "-" + ((newDay.getDate() < 10 ? "0" + newDay.getDate() : newDay.getDate()));

                    $scope.changeDate(newDayStr, newDayStr);

                    $scope.currentRange = "custom_selection";

                    $scope.refreshPresentation();
                },
                onMonthChange: function (year, month, inst) {

                    //summary.getCalendarDate(current_machine, year + '-' + (month + 1), function () {
                    //
                    //    inst.settings.invalid = getInvalidDays({
                    //        startDate: date,
                    //        endDate: date
                    //    }, month, year);
                    //
                    //    inst.refresh();
                    //
                    //});
                }
            });

            $('#date-time-picker').mobiscroll('setValues', [date]);
        }

        function generateDesktopPicker(startDate, endDate, single){

            var sdate = new Date(startDate.full),
                edate = new Date(endDate.full),
                mdate = new Date($scope.machineEndDate.full),
                nextMonthDatesEnabled,
                lastMonthDatesEnabled;

            //we must re-align our index
            sdate.setDate(sdate.getDate() + 1);
            edate.setDate(edate.getDate() + 1);
            mdate.setDate(mdate.getDate() + 1);
            sdate.setMonth(sdate.getMonth());
            edate.setMonth(edate.getMonth());
            mdate.setMonth(mdate.getMonth());

            //summary.getAvailableDaysByMonth(current_machine, (startDate.getYear() + 1900) + '-' + (startDate.getMonth() + 2), function(dates){
            //    nextMonthDatesEnabled = dates;
            //});
            //summary.getAvailableDaysByMonth(current_machine, (startDate.getYear() + 1900) + '-' + startDate.getMonth(), function(dates){
            //    lastMonthDatesEnabled = dates;
            //});

            var picker = $('#date-time-picker').daterangepicker({
                timePicker: false,
                format: 'YYYY-MM-DD',
                maxDate: mdate,
                startDate: sdate,
                endDate: edate,
                singleDatePicker: single,
                //datesEnabled: summary._json_summary,
                nextMonthDatesEnabled: nextMonthDatesEnabled,
                lastMonthDatesEnabled: lastMonthDatesEnabled,
                locale: {
                    applyLabel: $rootScope.LANG.SUBMIT,
                    cancelLabel: $rootScope.LANG.CANCEL,
                    fromLabel: $rootScope.LANG.FROM,
                    toLabel: $rootScope.LANG.TO,
                    customRangeLabel: 'Custom',
                    daysOfWeek: $rootScope.LANG.JOUR_MINI_FORCAL,
                    monthNames: $rootScope.LANG.MOIS,
                    firstDay: 1
                }
            });

            $('#date-time-picker').on('apply.daterangepicker', function (ev, picker) {

                var newStartDate = picker.startDate,
                    newEndDate = picker.endDate

                //set month one up
                newStartDate.month(newStartDate.month());
                newEndDate.month(newEndDate.month());

                //if (summary._json_summary && !inArray((day.getDate() + 1), summary._json_summary)) {
                //    $('#no-datas-calendar').html('<img src="images/warning.png" /> aucune donnée pour le ' + day_str);
                //    return false;

                $scope.changeDate(newStartDate.format("YYYY-MM-DD"), newEndDate.format("YYYY-MM-DD"));

                $scope.currentRange = "custom_selection";

                $scope.refreshPresentation();
                //window.location.href = window.location.pathname + '?debut=' + picker.startDate.format('YYYY-MM-DD') + '&fin=' + picker.endDate.format('YYYY-MM-DD') + '&machine=' + current_machine + '&g=c';
            });

            $('#date-time-picker').on('show.daterangepicker', function (ev, picker) {
                $('body').append('<div class="daterangepicker-overlay"></div>');

                $('.daterangepicker-overlay').click(function () {
                    $('.daterangepicker .ranges .cancelBtn').trigger("click");

                    $(".daterangepicker-overlay").remove();
                });

                $('.daterangepicker').css('left', $('.date-picker').offset().left + 5 + 'px !important');
            });
        }

        function getDaysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        function getInvalidDays(data, current, month, year){

            var invalidDays = [],
                daysTotal = getDaysInMonth(month + 1, year),
                startDate = current ? (current.startDate.getMonth() + 1) + '/' + current.startDate.getDate() : null,
                endDate = current ? (current.endDate.getMonth() + 1) + '/' + current.endDate.getDate() : null;

            for(var d = 1; d <= daysTotal; d++){
                //if(summary._json_summary == null || summary._json_summary.indexOf(d) < 0){
                //    var date = (month + 1) + '/' + d;
                //
                //    if(date != startDate && date != endDate) invalidDays.push(date);
                //}
            }

            return invalidDays;
        }

        function setDateByPicker(startDate, endDate){
            //change the date in here

            $rootScope.startDate = DashboardService.cleanDate(startDate);
            $rootScope.endDate = DashboardService.cleanDate(endDate);
        }

        function setDateByMachine(machine) {

            if(machine.firstConnectionTs) {
                $rootScope.startDate = DashboardService.cleanDate(machine.firstConnectionTs.split(' ')[0]);
                $rootScope.endDate = DashboardService.cleanDate(machine.lastConnectionTs.split(' ')[0]);

                $rootScope.machineStartDate = DashboardService.cleanDate(machine.firstConnectionTs.split(' ')[0]);
                $rootScope.machineEndDate = DashboardService.cleanDate(machine.lastConnectionTs.split(' ')[0]);

                $rootScope.noData = false;
            } else {
                $rootScope.noData = true;
            }

        }

        function setCurrentMachine(machine){
            $scope.currentMachine = machine;
            DashboardService.setCurrentMachine(machine);
        }

        function setMachines(machines){

            $scope.machines = machines;
            $scope.smartphones = [];
            $scope.vehicles = [];

            DashboardService.setMachines(machines);

            var smartPhoneIndex = 1;

            for(var m in machines){
                var machine = machines[m];

                switch(machine.type){
                    case "VEHICLE":
                        machine.title = machine.vehicle.name;

                        machine.vehicle['oldName'] = machine.vehicle.name;

                        $scope.vehicles.push(machine);

                    break;
                    case "SMARTPHONE":
                        machine.title = "Smartphone " + smartPhoneIndex;

                        $scope.smartphones.push(machine);

                        smartPhoneIndex++;
                    break;
                }

            }
        }

        function generateDatePicker(){

            var singleDate = true;

            if($state.current.name.indexOf('summary') == -1){
                singleDate = false;
            }

            if(!device.mobile()){
                if(singleDate){
                    generateDesktopPicker($rootScope.endDate, $rootScope.endDate, singleDate);
                } else {
                    generateDesktopPicker($rootScope.startDate, $rootScope.endDate, singleDate);
                }
            } else {
                if(singleDate){
                    generateMobileDatePicker($rootScope.endDate);
                } else {
                    generateMobileRangePicker($rootScope.startDate, $rootScope.endDate);
                }

                $('#car-selectbox').mobiscroll().select({theme: 'maif-material', display: 'bottom'});
            }
        }

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

        $scope.isSummaryPage = function(){
            if($state.current.name == "dashboard.summary") {
                $('#date-time-picker').removeClass('range');
                return false;
            } else {
                return true;
            }
        }

        $rootScope.$on('scopeUpdated', function(){
            generateDatePicker();
        });

        $scope.getMachines();

        $scope.exposed = {
            generateDesktopPicker: generateDesktopPicker
        };
    }])

    /**
     * @constructor DashboardMenuController
     * @memberOf module:dashboard/controllers
     */
    .controller("DashboardMenuController", ["$scope",
                                            "$rootScope",
                                            "$state",
                                            "DashboardStateService",
                                            "DashboardService",
                                            "UserService",
                                            "UserAuthService",
                                            "localStorageService",
                                            "hotkeys",
                                            "$window",
                                            "$timeout",
                                            function($scope,
                                                     $rootScope,
                                                     $state,
                                                     DashboardStateService,
                                                     DashboardService,
                                                     UserService,
                                                     UserAuthService,
                                                     localStorageService,
                                                     hotkeys,
                                                     $window,
                                                     $timeout){


        /**
         * @name links
         * @author Alex Boisselle
         * @type {array}
         * @memberOf module:dashboard/controllers.DashboardMenuController
         * @description array of user permissions, data bound to an ng-repeat, building the menu
         * @example
         * ['summary', 'mileage', 'harshevents', 'hours_travel']
         */
        $scope.links = UserService.permissions;

        if(UserAuthService.getUsername()){
            $scope.username = $rootScope.username = UserAuthService.getUsername();
        }

        /**
         * @function selectLangHandler
         * @author Alex Boisselle
         * @memberOf module:dasbhoard/controllers.DashboardMenuController
         * @description language button handler, sets local storage and reloads app
         * @fires $window.location.reload
         * @fires localStorageService.set
         */
        $scope.selectLangHandler = function(lang) {

            $rootScope.currentLang = lang;
            localStorageService.set('currentLang', lang);

            $timeout(function(){
                $window.location.reload();
            });
        };

        $scope.logoutHandler = function(){

            UserAuthService.logout().then(function(){
                $state.go('user.login');
                $('body').addClass('login');

                DashboardService.reset();
            });
        };

        $scope.combo1 = false;
        $scope.combo2 = false;
        $scope.combo3 = false;
        $scope.combo4 = false;
        $scope.combo5 = false;

        hotkeys.bindTo($scope)
        .add({
            combo: 'shift+d',
            callback: function() {
                if($rootScope.debug){
                    $rootScope.debug = false;
                    console.log("Goodbye :)");
                } else {
                    $scope.combo1 = true;
                    console.log("Hello :)");
                }
            }
        })
        .add({
            combo: 'd',
            callback: function() {
                if($scope.combo1){
                    $scope.combo2 = true;
                    console.log("Oh");
                }
            }
        })
        .add({
            combo: 'e',
            callback: function() {
                if($scope.combo2){
                    $scope.combo3 = true;
                    console.log("wow");
                }
            }
        })
        .add({
            combo: 'b',
            callback: function() {
                if($scope.combo3){
                    $scope.combo4 = true;
                    console.log("you");
                }
            }
        })
        .add({
            combo: 'u',
            callback: function() {
                if($scope.combo4){
                    $scope.combo5 = true;
                    console.log("got");
                } else {

                }
            }
        })
        .add({
            combo: 'g',
            callback: function() {
                if($scope.combo5){
                    if($rootScope.debug == true){
                        $rootScope.debug = false;
                    } else {
                        $rootScope.debug = true;
                        console.log("it!");
                    }
                    $scope.combo1 = false;
                    $scope.combo2 = false;
                    $scope.combo3 = false;
                    $scope.combo4 = false;
                    $scope.combo5 = false;
                }
            }
        })
        .add({
            combo: 'shift+m',
            callback: function(){
                if(location.host.indexOf('alpha') > -1){
                    if($rootScope.debug == true){
                        //console.log("MAIFcloseDEBUG");
                        $rootScope.debug = false;
                    } else {
                        //console.log("MAIFopenDEBUG");
                        $rootScope.debug = true;
                    }
                }
            }
        });
    }]);
})();