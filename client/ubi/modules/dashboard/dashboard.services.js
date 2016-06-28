/*jshint -W099*/

/**
 * iMetric
 * @module dashboard/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var dashboardServices = angular.module('UBIDriver.modules.dashboard.services', [])



    /**
     * @constructor DashboardService
     * @memberOf module:dashboard/services
     */
    .factory('DashboardService', ['$q', '$rootScope', 'UserService', 'UserAuthService', '$state', 'PATHS', 'STUB', '$http', '$timeout', 'localStorageService', function($q, $rootScope, UserService, UserAuthService, $state, PATHS, STUB, $http, $timeout, localStorageService){
        return {

            machines: [],
            currentMachine: {},
            currentVehicle: {},

            /**
             * @function getMachineData
             * @author Alex Boisselle
             * @memberOf module:dashboard/services.DashboardService
             * @description gets machines allocated to the current user
             * @returns {object} users machines
             */
            getMachineData: function(){

                var q          = $q.defer(),
                    self       = this,
                    un         = UserAuthService.getUsername(),
                    token      = UserAuthService.getToken(),
                    url        = PATHS.API + '/admin/' + PATHS.REALM + '/participants/' + un + '/machines?token=' + token,
                    machines   = [];

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

                    //data[0].machine.firstConnectionDateTime = "2014-01-08 05:24:05";
                    //data[0].machine.lastConnectionDateTime = "2014-01-10 08:14:19";

                    self.setMachines(data);
                    q.resolve(data);
                })
                .error(function(data, status, headers, config){
                    q.reject(status);
                });

                //$timeout(function(){
                //
                //    q.resolve(STUB.MACHINE);
                //
                //}, 500);

                return q.promise;
            },
            /**
             * @function getMachines
             * @author Alex Boisselle
             * @memberOf module:dashboard/services.DashboardService
             * @description if machines already fetched, just returns machines
             * @param {boolean} force - use force param to force a new request
             * @returns {object} users machines
             */
            getMachines: function(force){
                var q          = $q.defer(),
                    self       = this;

                if(self.machines.length < 1 || force){
                    self.getMachineData().then(function(data){
                        q.resolve(data);
                    }, function(){
                        q.reject();
                    });
                } else {
                    q.resolve(self.machines);
                }

                return q.promise;
            },
            /**
             * @function setMachines
             * @author Alex Boisselle
             * @memberOf module:dashboard/services.DashboardService
             * @description called by controller, sets self.machines
             * @param {object} machines - machines object
             */
            setMachines: function(machines){
                this.machines = machines;
            },
            /**
             * @function getCurrentMachine
             * @author Alex Boisselle
             * @memberOf module:dashboard/services.DashboardService
             * @description returns the current machine
             * @returns {object} currentMachine - the currently selected machine
             */
            getCurrentMachine: function(){
                return this.currentMachine;
            },
            /**
             * @function setCurrentMachine
             * @author Alex Boisselle
             * @memberOf module:dashboard/services.DashboardService
             * @description sets the current machine
             */
            setCurrentMachine: function(machine){
                this.currentMachine = machine;
            },
            cleanDate: function(dirtyDate){

                var cleanYear,
                    cleanMonth,
                    cleanDay;

                cleanYear = dirtyDate.split('-')[0].replace(/^0+/, '');
                cleanMonth = dirtyDate.split('-')[1].replace(/^0+/, '');
                cleanDay = dirtyDate.split('-')[2].replace(/^0+/, '');

                return {
                    full: dirtyDate,
                    year: cleanYear,
                    month: cleanMonth,
                    day: cleanDay
                }
            },
            reset: function(){
                this.machines = [];
                this.currentMachine = {};
                this.currentVehicle = {};
            },
            setLessonCookie: function(){
                localStorageService.set('lesson', UserService.user.username + "&" + moment().startOf('week').isoWeekday(2).format('MM-DD-YYYY'));
            },
            getLessonCookie: function(){
                if(localStorageService.get('lesson')){
                    var lessonCookie = localStorageService.get('lesson'),
                        username = lessonCookie.split('&')[0],
                        date = lessonCookie.split('&')[1];

                    if(username = UserService.user.username){

                        //check if date is last week or this week's date
                        //all checks done in ms (format('x'))

                        var dateMoment = moment(date, 'MM-DD-YYYY').format('x');

                        var lastWeekStartDate = moment().startOf('week').isoWeekday(1).format('x'),
                            lastWeekEndDate = moment().endOf('week').isoWeekday(1).format('x');

                        var thisWeekStartDate = moment().startOf('week').isoWeekday(8).format('x'),
                            thisWeekEndDate = moment().endOf('week').isoWeekday(8).format('x');

                        if(dateMoment > lastWeekStartDate && dateMoment < lastWeekEndDate){
                            return lessonCookie; //cookie was stored within the right week
                        }

                        if(dateMoment < lastWeekStartDate){
                            return false; //old cookie
                        }

                    } else {
                        return false; //un does not match
                    }
                } else {
                    return false; //no cookie found
                }
            },
            getLessonID: function(){
                var q          = $q.defer(),
                    self       = this,
                    un         = UserAuthService.getUsername(),
                    token      = UserAuthService.getToken(),
                    machine    = this.currentMachine,
                    startDate  = $rootScope.startDate.full,
                    endDate    = $rootScope.endDate.full,
                    url        = PATHS.API + '/metrics/machines/' + machine.machineIdentifier + '/drivingAdvice?startDate=' + startDate + '&endDate=' + endDate + '&token=' + token;

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
                    q.resolve(data);
                })
                .error(function(data, status, headers, config){
                    q.reject(status);
                });

                return q.promise;
            },
            getLessonContent: function(id){
                var q          = $q.defer(),
                    self       = this,
                    un         = UserAuthService.getUsername(),
                    token      = UserAuthService.getToken(),
                    machines   = [];

                $http.get(PATHS.DASHBOARD + '/lessons/lesson_' + id + '.html')
                .success(function(data, status, headers, config){
                    q.resolve(data);
                })
                .error(function(data, status, headers, config){
                    q.reject(status);
                });


                return q.promise;
            }
        };
    }])
    /**
     * @constructor DashboardStateService
     * @memberOf module:dashboard/services
     */
    .factory('DashboardStateService', ['$q', '$rootScope', '$dashboardStateProvider', '$state', 'STUB', function($q, $rootScope, $dashboardStateProvider, $state, STUB){
        return {

            /**
             * @function generateStates
             * @author Alex Boisselle
             * @memberOf module:dashboard/services.DashboardStateService
             * @param {array} permissions - an arary list of user permissions
             * @description generates states on the fly using the dashboard state provider "addState" located in dashboard.module.js
             * @fires $dashboardStateProvider.addState
             * @see module:dashboard.module#$dashboardStateProvider
             */
            generateStates: function(permissions) {

                var states = permissions.concat(STUB.CONTENT);

                for(var s in states){

                    var title = states[s],
                        controller = true;

                    if(title == "faq" || title == "info" || title == "tips"){
                        controller = false;
                    }

                    $dashboardStateProvider.addState(title, controller);
                }
            }
        };
    }])
    .factory('GraphConfigService', ['$q', '$rootScope', function($q, $rootScope){
        return {

            areaChartConfig: function(series, category, min_x, max_x, axis){

                var xAxis = {
                    categories: category,
                    tickWidth: 0,
                    labels: {
                        rotation: -45,
                        style: {
                            color: '#87878A',
                            fontWeight: 'regular',
                            fontSize: '11px'
                        }
                    },
                    min: parseInt(min_x),
                    max: parseInt(max_x)
                };

                var yAxis = [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} km',
                        enabled: true
                    }
                }];

                if(axis){
                    if(axis.x){
                        xAxis = axis.x;
                    }

                    if(axis.y){
                        yAxis = axis.y;
                    }
                }

                var config = {
                    chart: {
                        backgroundColor: '#FFFFFF',
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    scrollbar: {
                        enabled: true,
                        height: 25,
                        minWidth: 20
                    },
                    xAxis: xAxis,
                    yAxis: yAxis,
                    tooltip: {
                        shared: true
                    },
                    exporting: {
                        enabled: false
                    },
                    series: series,
                    options: {
                        scrollbar: {
                            enabled: true,
                            height: 25,
                            minWidth: 25
                        },
                        plotOptions: {
                            series: {
                                point: {
                                    events: {
                                        mouseOver: function (event) {
                                            if (typeof event.currentTarget.grade != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.grade]);
                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.grade].replace(/\+/g, ' ').toLowerCase());
                                            }
                                        },
                                        mouseOut: function (event) {
                                            if (typeof event.currentTarget.original != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.original]);
                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.original].replace(/\+/g, ' ').toLowerCase());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                return config;
            },

            splineChartConfig: function(series, category, min_y, max_y, axis){

                var xAxis = {
                    categories: category,
                    tickWidth: 0,
                    labels: {
                        enabled: true,
                        style: {
                            color: '#87878A',
                            fontWeight:'regular',
                            fontSize:'11px'
                        }
                    }
                };

                var yAxis = [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} km',
                        enabled: true
                    },
                    min: min_y,
                    max: max_y
                }];

                if(axis){
                    if(axis.x){
                        xAxis = axis.x;
                    }

                    if(axis.y){
                        yAxis = axis.y;
                    }
                }

                var config = {
                    credits: {
                        enabled: false
                    },
                    chart: {
                        backgroundColor: '#FFFFFF',
                            type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    scrollbar: {
                        enabled: false,
                            height: 25,
                            minWidth: 25
                    },
                    xAxis: xAxis,
                    yAxis: yAxis,
                    options: {
                        tooltip: {
                            formatter: function() {
                                var s = [];

                                s.push('<span>' + this.x + '</span><br/><br/>');

                                $.each(this.points, function(i, point) {
                                    s.push('<span style="color:{series.color};font-weight:bold;">'+ point.series.name +'<span> : ' + this.y + '<br/>');
                                });

                                return s.join('');
                            },
                            shared: true
                        },
                        plotOptions: {
                            series: {
                                point: {
                                    events: {
                                        mouseOver: function(event){
                                            if (typeof event.currentTarget.grade != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.grade]);
                                                $('#' + event.currentTarget.cible).attr('class','note '+$rootScope.LANG.GRADE[event.currentTarget.grade].replace(/\+/g,' ').toLowerCase());
                                                if (typeof event.currentTarget.cible2 != 'undefined') {
                                                    var testlength = event.currentTarget.grade2.toString().length;
                                                    if (testlength > 3) {
                                                        $('#' + event.currentTarget.cible2).addClass('small');
                                                    } else {
                                                        $('#' + event.currentTarget.cible2).removeClass('small');
                                                    }
                                                    $('#' + event.currentTarget.cible2).html(event.currentTarget.grade2);
                                                }

                                            }
                                        },
                                        mouseOut : function(event){
                                            if (typeof event.currentTarget.original != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.original]);
                                                $('#' + event.currentTarget.cible).attr('class','note '+$rootScope.LANG.GRADE[event.currentTarget.original].replace(/\+/g,' ').toLowerCase());
                                                if (typeof event.currentTarget.cible2 != 'undefined') {
                                                    if (event.currentTarget.original2.toString().length > 3) {
                                                        $('#' + event.currentTarget.cible2).addClass('small');
                                                    } else {
                                                        $('#' + event.currentTarget.cible2).removeClass('small');
                                                    }
                                                    $('#' + event.currentTarget.cible2).html(event.currentTarget.original2);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    series: series
                };

                return config;
            },

            areaSplineChartConfig: function(series, category, min_x, max_x, axis){

                var xAxis = {
                    categories: category,
                    tickWidth: 0,
                    labels: {
                        enabled: true,
                        style: {
                            color: '#87878A',
                            fontWeight:'regular',
                            fontSize:'11px'
                        }
                    },
                    min: min_x,
                    max: max_x
                };

                var yAxis = [{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} km/h',
                        enabled: true
                    }
                },{
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} Km',
                        enabled: true
                    },
                    opposite: true,
                    min: 0
                }];

                if(axis){
                    if(axis.x){
                        xAxis = axis.x;
                    }

                    if(axis.y){
                        yAxis = axis.y;
                    }
                }

                var config = {
                    credits: {
                        enabled: false
                    },
                    chart: {
                        backgroundColor: '#FFFFFF',
                            type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    scrollbar: {
                        enabled: true,
                            height: 25,
                            minWidth: 25
                    },
                    xAxis: xAxis,
                    yAxis: yAxis,
                    options: {
                        tooltip: {
                            formatter: function() {
                                var s = [];

                                s.push('<span>' + this.x + '</span><br/><br/>');

                                $.each(this.points, function(i, point) {
                                    s.push('<span style="color:{series.color};font-weight:bold;">'+ point.series.name +'<span> : ' + this.y + '<br/>');
                                });

                                return s.join('');
                            },
                            shared: true
                        },
                        scrollbar: {
                            enabled: true,
                                height: 25,
                                minWidth: 25
                        },
                        plotOptions: {
                            series: {
                                point: {
                                    events: {
                                        mouseOver: function (event) {

                                            if (typeof event.currentTarget.grade != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {

                                                //console.log("do it");

                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.grade]);

                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.grade].replace(/\+/g,' ').toLowerCase());

                                                if (typeof event.currentTarget.cible2 != 'undefined') {
                                                    var testlength = event.currentTarget.grade2.toString().length;
                                                    if (testlength > 3) {
                                                        $('#' + event.currentTarget.cible2).addClass('small');
                                                    } else {
                                                        $('#' + event.currentTarget.cible2).removeClass('small');
                                                    }
                                                    $('#' + event.currentTarget.cible2).html(event.currentTarget.grade2);
                                                }

                                            }
                                        },
                                        mouseOut: function (event) {
                                            if (typeof event.currentTarget.original != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {

                                                //$('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.original]);
                                                //$('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.original].replace(/\+/g,' ').toLowerCase());
                                                //
                                                //if (typeof event.currentTarget.cible2 != 'undefined') {
                                                //    if (event.currentTarget.original2.toString().length > 3) {
                                                //        $('#' + event.currentTarget.cible2).addClass('small');
                                                //    } else {
                                                //        $('#' + event.currentTarget.cible2).removeClass('small');
                                                //    }
                                                //    $('#' + event.currentTarget.cible2).html(event.currentTarget.original2);
                                                //}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    series: series
                };

                return config;
            },

            stackingChartConfig: function(series, category, min_x, max_x, axis){

                var xAxis = {
                    categories: category,
                    tickmarkPlacement: 'on',
                    title: {
                        enabled: false,
                        tickWidth: 0,
                        labels: {
                            rotation: -45,
                            style: {
                                color: '#87878A',
                                fontWeight:'regular',
                                fontSize:'11px'
                            }
                        }
                    },
                    min:min_x,
                    max:max_x
                };

                var yAxis =  {
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value} %',
                        enabled: true
                    }
                };

                if(axis){
                    if(axis.x){
                        xAxis = axis.x;
                    }

                    if(axis.y){
                        yAxis = axis.y;
                    }
                }

                var config = {
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    scrollbar: {
                        enabled: true,
                            height: 25,
                            minWidth: 20
                    },
                    legend: {
                        itemDistance: 50
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%<br/>',
                        shared: true
                    },
                    options: {
                        tooltip: {
                            formatter: function() {
                                var s = [];

                                s.push('<span>' + this.x + '</span><br/><br/>');

                                $.each(this.points, function(i, point) {
                                    s.push('<span style="color:{series.color};font-weight:bold;">'+ point.series.name +'<span> : ' + Math.round(point.percentage) + '% <br/>');
                                });

                                return s.join('');
                            },
                            shared: true
                        },
                        scrollbar: {
                            enabled: true,
                                height: 25,
                                minWidth: 25
                        },
                        chart: {
                            type: 'column'
                        },
                        xAxis: xAxis,
                        yAxis: yAxis,
                        plotOptions: {
                            column: {
                                stacking: 'percent',
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.percentage:.0f}',
                                    color: 'white',
                                    style: {
                                        textShadow: 'none'
                                    }
                                }
                            },
                            series: {
                                point: {
                                    events: {
                                        mouseOver: function (event) {
                                            if (typeof event.currentTarget.grade != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.grade]);
                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.grade].replace(/\+/g,' ').toLowerCase());
                                            }
                                        },
                                        mouseOut: function (event) {
                                            if (typeof event.currentTarget.original != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.original]);
                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.original].replace(/\+/g,' ').toLowerCase());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    series: series
                }

                return config;
            },

            pieChartConfig: function(series){
                var view_port = $(window).width();

                var config = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    options: {
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                    enabled: (view_port >= 750),
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                },
                                showInLegend: true
                            },
                            series: {
                                point: {
                                    events: {
                                        mouseOver: function (event) {
                                            if (typeof event.currentTarget.grade != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.grade]);
                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.grade].replace(/\+/g,' ').toLowerCase());
                                            }
                                        },
                                        mouseOut: function (event) {
                                            if (typeof event.currentTarget.original != 'undefined' && $('#' + event.currentTarget.cible).length > 0) {
                                                $('#' + event.currentTarget.cible).html($rootScope.LANG.GRADE[event.currentTarget.original]);
                                                $('#' + event.currentTarget.cible).attr('class', 'note ' + $rootScope.LANG.GRADE[event.currentTarget.original].replace(/\+/g,' ').toLowerCase());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        labelFormatter: function() {
                            if (view_port >= 750)
                                return this.name;
                            return this.name + " (" + this.y + "%)";
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        type: 'pie',
                        name: ' ',
                        data: series
                    }]
                }

                return config;
            }
        }
    }]);
})();