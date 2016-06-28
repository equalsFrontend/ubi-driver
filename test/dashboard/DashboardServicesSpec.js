    "use strict";

describe('Dashboard Services', function() {

    var dashboardService, dashboardStateService, graphConfigService, rootScope, state, stub, mockStates, paths, http, timeout;

    beforeEach(module('UBIDriver'));
    beforeEach(module('UBIDriver.modules.dashboard.services'));

    beforeEach(inject( function(_DashboardService_, _DashboardStateService_, _GraphConfigService_, _$rootScope_, _$state_, $httpBackend, _$timeout_, _STUB_, _PATHS_){

        dashboardService = _DashboardService_;
        dashboardStateService = _DashboardStateService_;
        graphConfigService = _GraphConfigService_;

        rootScope = _$rootScope_;
        state = _$state_;
        stub = _STUB_;
        http = $httpBackend;
        timeout = _$timeout_;
        paths = _PATHS_;

        http.expectGET('client/ubi/modules/preloader/preloader.view.html').respond({});

    }));

    describe('> DashboardService', function(){
        describe('.getMachineData', function() {

            it('returns driving location average json obj', function(){

                var machines = {
                    "0": stub.MACHINE
                };

                http.when('GET', paths.API + '/admin/maif_ubi/participants/false/machines?token=false').respond(machines);

                dashboardService.getMachineData().then(function(data){

                    expect(data).toEqual(machines);

                }, function(){
                    console.log("error");
                });

                timeout.flush();
                http.flush();
            });

            it('rejects if fail or empty', function(){
                http.when('GET', paths.API + '/admin/maif_ubi/participants/false/machines?token=false').respond(401, '');

                dashboardService.getMachineData().then(function(){
                    expect(0).toEqual(1);
                }, function(response){
                    //expect in success block should fail if run, however it doesn't run, so this suite passes
                });

                http.flush();
            });
        });

        describe('.getMachines', function() {

            it('uses private method to grab machines with ajax', function(){

                var machines = {
                    "0": stub.MACHINE
                }

                http.when('GET', paths.API + '/admin/maif_ubi/participants/false/machines?token=false').respond(machines);

                dashboardService.getMachines().then(function(m){
                    expect(m).toEqual(machines);
                }, function(){
                    expect(10).toEqual(1); //will throw error if services is failing
                });

                timeout.flush();
                http.flush();
            });

            it('returns from object if exists already', function(){
                dashboardService.machines = [{
                    "0": stub.MACHINE
                }];

                dashboardService.getMachines().then(function(m){
                    expect(m.length).toEqual(1);
                }, function(){
                    expect(10).toEqual(1); //will throw error if services is failing
                });

                timeout.flush();
                http.flush();
            });
        });

        describe('.getCurrentMachine', function() {

            it('returns currentMachine obj', function(){

                dashboardService.currentMachine = stub.MACHINE;

                var machine = dashboardService.getCurrentMachine();

                expect(machine).toEqual(stub.MACHINE);
            });
        });

        describe('.setCurrentMachine', function() {

            it('sets current machine', function(){

                dashboardService.setCurrentMachine(stub.MACHINE);

                expect(dashboardService.currentMachine).toEqual(stub.MACHINE);
            });
        });

        describe('.cleanDate', function() {

            it('removes zeros from date and builds obj', function(){

                var dirtyDate = "2015-01-01";

                var cleanDate = dashboardService.cleanDate(dirtyDate);

                expect(cleanDate.full).toEqual('2015-01-01');
                expect(cleanDate.year).toEqual('2015');
                expect(cleanDate.month).toEqual('1');
                expect(cleanDate.day).toEqual('1');
            });
        });
    });

    describe('> DashboardStateService', function(){

        describe('.generateStates', function(){

            it('generates a state and route based on each mock permission', function(){

                var states,
                    dashboardSubStates = [],
                    mockStates = stub.PERMISSIONS;

                    dashboardStateService.generateStates(mockStates);

                //state.get returns an object containing each state as a property
                states = state.get();

                for(var i in states){
                    var s = states[i];

                    //if the state name has the '.' in it, it means it's a sub state, the name will folloew
                    if(s.name.indexOf('dashboard.') > -1){
                        dashboardSubStates.push(s.name.replace('dashboard.', ''));
                    }
                }

                //same amount of generated states as mock states
                //expect(dashboardSubStates.length).toEqual(mockStates.length);
            });
        });
    });

    describe('> GraphConfigStateService', function(){

        describe('.areaChartConfig', function(){

            it('returns area chart config', function(){

                var series = 0, category = 0, min_x = 0, max_x = 0, axis;

                axis = {
                    x:  {
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
                    },
                    y: {
                        title: {
                            text: ''
                        },
                        labels: {
                            format: '{value} km',
                            enabled: true
                        }
                    }
                };

                var configWithAxis = graphConfigService.areaChartConfig(series, category, min_x, max_x, axis);

                expect(configWithAxis.series).toEqual(series);
                expect(configWithAxis.xAxis.categories).toEqual(category);
                expect(configWithAxis.xAxis.min).toEqual(min_x);
                expect(configWithAxis.xAxis.max).toEqual(max_x);

                var configNoAxis = graphConfigService.areaChartConfig(series, category, min_x, max_x);

                expect(configNoAxis.series).toEqual(series);
                expect(configNoAxis.xAxis.categories).toEqual(category);
                expect(configNoAxis.xAxis.min).toEqual(min_x);
                expect(configNoAxis.xAxis.max).toEqual(max_x);

                //test mouse events
                var mockEvent = {
                    currentTarget: {
                        grade: '1',
                        cible: 'a',
                        original: '1'
                    }
                };

                $('html').html('<div id="a"></div>');

                rootScope['LANG'] = {
                    GRADE: ['a', 'b', 'c']
                };

                configNoAxis.options.plotOptions.series.point.events.mouseOver(mockEvent);


                $('html').html('<div id="a"></div>');
                configNoAxis.options.plotOptions.series.point.events.mouseOut(mockEvent);
            });
        });

        describe('.splineChartConfig', function(){

            it('returns spline chart config', function(){

                var series = 0, category = 0, min_y = 0, max_y = 0, axis;

                axis = {
                    x:  {
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
                    },
                    y: [{
                        title: {
                            text: ''
                        },
                        labels: {
                            format: '{value} km',
                            enabled: true
                        },
                        min: min_y,
                        max: max_y
                    }]
                };

                var configWithAxis = graphConfigService.splineChartConfig(series, category, min_y, max_y, axis);

                expect(configWithAxis.series).toEqual(series);
                expect(configWithAxis.xAxis.categories).toEqual(category);
                expect(configWithAxis.yAxis[0].min).toEqual(min_y);
                expect(configWithAxis.yAxis[0].max).toEqual(max_y);

                var configNoAxis = graphConfigService.splineChartConfig(series, category, min_y, max_y);

                expect(configNoAxis.series).toEqual(series);
                expect(configNoAxis.xAxis.categories).toEqual(category);
                expect(configNoAxis.yAxis[0].min).toEqual(min_y);
                expect(configNoAxis.yAxis[0].max).toEqual(max_y);

                configNoAxis.tooltip.y = 0;

                var formatted = configNoAxis.tooltip.formatter();

                expect(formatted).toEqual('<b>0</b>');

                //test mouse events
                var mockEvent = {
                    currentTarget: {
                        grade: '1',
                        grade2: '1',
                        cible: 'a',
                        cible2: 'b',
                        original: '1',
                        original2: '2'
                    }
                };

                $('html').html('<div id="a"></div>');

                rootScope['LANG'] = {
                    GRADE: ['a', 'b', 'c']
                };

                configNoAxis.plotOptions.series.point.events.mouseOver(mockEvent);


                $('html').html('<div id="a"></div>');
                configNoAxis.plotOptions.series.point.events.mouseOut(mockEvent);
            });
        });

        describe('.areaSplineChartConfig', function(){

            it('returns area spline chart config', function(){

                var series = 0, category = 0, min_x = 0, max_x = 0, axis;

                axis = {
                    x:  {
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
                    },
                    y: [{
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
                    }]
                };

                var configWithAxis = graphConfigService.areaSplineChartConfig(series, category, min_x, max_x, axis);

                expect(configWithAxis.series).toEqual(series);
                expect(configWithAxis.xAxis.categories).toEqual(category);
                expect(configWithAxis.xAxis.min).toEqual(min_x);
                expect(configWithAxis.xAxis.max).toEqual(max_x);

                var configNoAxis = graphConfigService.areaSplineChartConfig(series, category, min_x, max_x);

                expect(configNoAxis.series).toEqual(series);
                expect(configNoAxis.xAxis.categories).toEqual(category);
                expect(configNoAxis.xAxis.min).toEqual(min_x);
                expect(configNoAxis.xAxis.max).toEqual(max_x);

                configNoAxis.tooltip.y = 0;

                var formatted = configNoAxis.tooltip.formatter();

                expect(formatted).toEqual('<b>0</b>');

                //test mouse events
                var mockEvent = {
                    currentTarget: {
                        grade: '1',
                        grade2: '1',
                        cible: 'a',
                        cible2: 'b',
                        original: '1',
                        original2: '2'
                    }
                };

                $('html').html('<div id="a"></div>');

                rootScope['LANG'] = {
                    GRADE: ['a', 'b', 'c']
                };

                configNoAxis.options.plotOptions.series.point.events.mouseOver(mockEvent);


                $('html').html('<div id="a"></div>');
                configNoAxis.options.plotOptions.series.point.events.mouseOut(mockEvent);
            });
        });

        describe('.stackingChartConfig', function(){

            it('returns stacking chart config', function(){

                var series = 0, category = 0, min_x = 0, max_x = 0, axis;

                axis = {
                    x:  {
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
                    },
                    y: {
                        title: {
                            text: ''
                        },
                        labels: {
                            format: '{value} %',
                            enabled: true
                        }
                    }
                };

                var configWithAxis = graphConfigService.stackingChartConfig(series, category, min_x, max_x, axis);

                expect(configWithAxis.series).toEqual(series);
                expect(configWithAxis.options.xAxis.categories).toEqual(category);
                expect(configWithAxis.options.xAxis.min).toEqual(min_x);
                expect(configWithAxis.options.xAxis.max).toEqual(max_x);

                var configNoAxis = graphConfigService.stackingChartConfig(series, category, min_x, max_x);

                expect(configNoAxis.series).toEqual(series);
                expect(configNoAxis.options.xAxis.categories).toEqual(category);
                expect(configNoAxis.options.xAxis.min).toEqual(min_x);
                expect(configNoAxis.options.xAxis.max).toEqual(max_x);

                //test mouse events
                var mockEvent = {
                    currentTarget: {
                        grade: '1',
                        cible: 'a',
                        original: '1'
                    }
                };

                $('html').html('<div id="a"></div>');

                rootScope['LANG'] = {
                    GRADE: ['a', 'b', 'c']
                };

                configNoAxis.options.plotOptions.series.point.events.mouseOver(mockEvent);


                $('html').html('<div id="a"></div>');
                configNoAxis.options.plotOptions.series.point.events.mouseOut(mockEvent);

            });
        });

        describe('.pieChartConfig', function(){

            it('returns pie chart config', function(){

                var series = 0;

                var config = graphConfigService.pieChartConfig(series);

                expect(config.series[0].data).toEqual(series);

                config.legend.name = "name";
                config.legend.y = "0";


                var formattedBigWidth = config.legend.labelFormatter();

                expect(formattedBigWidth).toEqual('name (0%)');

                //test mouse events
                var mockEvent = {
                    currentTarget: {
                        grade: '1',
                        cible: 'a',
                        original: '1'
                    }
                };

                $('html').html('<div id="a"></div>');

                rootScope['LANG'] = {
                    GRADE: ['a', 'b', 'c']
                };

                config.options.plotOptions.series.point.events.mouseOver(mockEvent);


                $('html').html('<div id="a"></div>');
                config.options.plotOptions.series.point.events.mouseOut(mockEvent);
            });
        });
    });

});