/*jshint -W099*/
/**
* iMetric
* @author Alex Boisselle
*/

(function(){

"use strict";

var historyControllers = angular.module('UBIDriver.modules.history.controllers', [])

    .controller("HistoryController", ["$scope",
                                      "$rootScope",
                                      "$state",
                                      "$sce",
                                      "$timeout",
                                      "HistoryService",
                                      "DashboardService",
                                      function($scope,
                                               $rootScope,
                                               $state,
                                               $sce,
                                               $timeout,
                                               HistoryService,
                                               DashboardService){

        $scope.availableDates = {};
        $scope.years = [];

        $scope.getHistoryData = function(month, year){

            var startDate = moment([year, month]),
                endDate = moment(startDate).endOf('month');

            if($('#advice-group-' + year + '-' + month + ' md-card').length < 1) {

                HistoryService.getHistoryData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')).then(function (data) {

                    $scope.availableDates[year].months[month].weeks = data;

                    angular.forEach($scope.availableDates[year].months[month].weeks, function (value, key) {

                        //we need to extract the title and discipline from the content
                        //in the lessons to properly display the info in the boxes
                        DashboardService.getLessonContent(value.code).then(function (_content) {

                            var title,
                                discipline,
                                rand      = Math.floor(Math.random() * 100000),

                                //creates angular element object from content
                                content   = angular.element(_content),

                                //creates empty container to store content in
                                container = angular.element('<div id="container-' + rand + '" style="display:none;"></div>');

                            //add container to the DOM
                            angular.element('body').append(container);

                            //add the content to the new container
                            angular.element(document.getElementById('container-' + rand)).append(content);

                            //extract the title of the lesson
                            title = $('#container-' + rand + ' h2').text();

                            //extract the discipline of the lesson
                            discipline = $('#container-' + rand + ' grade').attr('discipline');

                            //store the information in the object
                            value['title'] = title;
                            value['discipline'] = discipline;

                            //remove the temp container
                            angular.element(document.getElementById('container-' + rand)).remove();

                        });
                    });

                    $('#advice-group-' + year + '-' + month).addClass('open');
                    $('#advice-group-' + year + '-' + month + ' > button').removeClass('md-ink-ripple');
                    $('#advice-group-' + year + '-' + month + ' > button').css('cursor', 'default');
                    $('#advice-group-' + year + '-' + month + ' > button > .md-ripple-container').remove();

                }, function () {
                    $scope.availableDates[year].months[month].weeks = "no data";
                });
            } else {
                $('#advice-group-' + year + '-' + month + ' > button > .md-ripple-container').remove();
            }
        };

        $scope.extractDay = function(date){
            var day = date.split('-')[2];

            return day.replace(/^0+/, '');
        };

        var now = moment(),
            startOfThisMonth  = now.startOf('month').format('YYYY-MM-DD'),
            endOfThisMonth    = now.endOf('month').format('YYYY-MM-DD'),

            machineStartDate  = DashboardService.currentMachine.firstConnectionTs.split(' ')[0],
            machineEndDate    = DashboardService.currentMachine.lastConnectionTs.split(' ')[0],

            machineStartYear  = machineStartDate.split('-')[0],
            machineEndYear    = machineEndDate.split('-')[0],

            machineStartMonth = machineStartDate.split('-')[1] - 1,
            machineEndMonth   = machineEndDate.split('-')[1] - 1;

        //create each year and each month in the year depending on start/end dates
        for (var i = machineStartYear; i <= machineEndYear; i++) {
            $scope.years.push(i);

            $scope.availableDates[i] = {
                'year': i,
                'months': {}
            };

            //if person has spanned over new years (doesn't have to be a full year of data
            if(machineStartYear != machineEndYear){

                //TODO: REVIEW LOGIC

                //first year
                if(i == machineStartYear){
                    for(var m = machineStartMonth; m <= 11; m++) {
                        $scope.availableDates[machineStartYear].months[m] = {
                            'id': m,
                            'weeks': {}
                        };
                    }
                }

                //middle years
                if(i != machineStartYear && i != machineEndYear) {
                    for(var m = 0; m <= 11; m++) {
                        $scope.availableDates[i].months[m] = {
                            'id': m,
                            'weeks': {}
                        };
                    }
                }

                //end year
                if(i == machineEndYear){
                    for(var m = 0; m <= machineEndMonth; m++) {
                        $scope.availableDates[machineEndYear].months[m] = {
                            'id': m,
                            'weeks': {}
                        };

                        //if on the last month of the last year, do the call
                        if(m == machineEndMonth){
                            $scope.getHistoryData(m, i);
                        }
                    }
                }
            }
        }

        //console.log($scope.availableDates);
    }]);
})();