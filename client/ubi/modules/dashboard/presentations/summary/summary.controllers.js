/*jshint -W099*/
/**
 * iMetric
 * @module presentation/summary/controllers
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var speedController = angular.module('UBIDriver.modules.dashboard.presentations.summary.controllers', [])

    .controller("SummaryController", ["$scope", "$rootScope", "$state", "$sce", "$timeout", "SummaryService", "DashboardService", "UserService", function($scope, $rootScope, $state, $sce, $timeout, SummaryService, DashboardService, UserService){

        $scope.getSummaryData = function(date){

            if(DashboardService.currentMachine.lastConnectionTs && $rootScope.refreshing == false){
                $rootScope.endDate = DashboardService.cleanDate(DashboardService.currentMachine.lastConnectionTs.split(' ')[0]);
            }

            $rootScope.refreshing = false;

            SummaryService.getSummaryData(date).then(function(data){

                $scope.setSummaryData(data, date);
                $scope.setCarouselData(data);

                $rootScope.$broadcast('scopeUpdated');

                $timeout(function(){
                    $scope.checkPopupCookie();
                }, 1400);
            });
        };

        $scope.setSummaryData = function(summary, date){
            $scope.summaryData = summary;

            for(var g in summary.gradeByCriteria){
                UserService.setGrade(g, summary.gradeByCriteria[g]);
            }

            if(date){
                $scope.summaryDate = date;
            } else {

                var summaryDatesArray = [];

                for(var p in summary.gradeForLast30Day){
                    var date = p;

                    summaryDatesArray.push(date);
                }
            }
        };

        $scope.setCarouselData = function(summary){

            $scope.carouselData = {};

            var gradesDatesArray = Object.keys(summary.gradeForLast30Day),
                c = 0,
                startingCarouselMonth,
                startingCarouselYear,
                lastDate;

            //get last date in 30 day summary
            lastDate = gradesDatesArray[gradesDatesArray.length-1];

            //get month and year of last date
            startingCarouselMonth = $rootScope.LANG.MOIS[lastDate.split('-')[1] - 1];
            startingCarouselYear = lastDate.split('-')[0];

            //set template to lasts
            $scope.carouselMonth = startingCarouselMonth;
            $scope.carouselYear = startingCarouselYear;

            for (var i in summary.gradeForLast30Day) {

                var grade,
                    gradeClass,
                    year,
                    dayName,
                    dayNum,
                    dayOfWeekNum,
                    monthName,
                    position,
                    dateStringArray,
                    dateObject;

                dateStringArray = i.split('-');

                dateObject = new Date(Number(dateStringArray[0]), Number(dateStringArray[1]-1), Number(dateStringArray[2]));

                dayOfWeekNum = dateObject.getDay() - 1;
                if(dayOfWeekNum == -1) dayOfWeekNum = 6; //reversing to monday

                //setup the vars that will are used in the template
                grade         = $rootScope.LANG.GRADE[summary.gradeForLast30Day[i]];
                gradeClass    = $rootScope.LANG.GRADE[summary.gradeForLast30Day[i]].toLowerCase().replace(/\+/g, '');
                monthName     = $rootScope.LANG.MOIS[dateStringArray[1] - 1];
                dayName       = $rootScope.LANG.JOUR[dayOfWeekNum];
                dayNum        = dateStringArray[2].replace(/^0+/, '');
                year          = dateStringArray[0];
                position      = c + 1;

                $scope.carouselData[c] = {
                    grade: grade,
                    gradeClass: gradeClass,
                    year: year,
                    month: monthName,
                    day: dayName,
                    dayNum: dayNum,
                    position: position
                };

                c++;
            }

            if($scope.carouselData[0]){
                //$('.historique-container .year').html($scope.carouselData[0].year);
                //$('.historique-container .month').html($scope.carouselData[0].month + '<span class="arrow"></span>');

                $timeout(function(){
                    var el = $('.data-historique .next'),
                        total = $(".historique-container .timeline li").length,
                        width_elem = $(el).parent().find(".timeline li").first().width(),
                        timeline_width = $('.timeline').css('width').replace('px', '');

                    //console.log($(el).parent().find(".timeline li"));

                    $(el).parent().find(".timeline li").animate({
                        'left': "-=" + (width_elem * (total - (Math.round((timeline_width - 30) / width_elem)))) + "px"
                    }, 0, function () {

                        $scope.slinding = false;
                    });

                    $('.data-historique .next').css('opacity', 0);
                }, 100);
            }
        };

        $scope.scrollCarouselLeft = function(ev){

            var el = ev.currentTarget,
                width_elem = $(el).parent().find(".timeline li").first().width(),
                current_slide = $(el).parent().find(".timeline li").first().position().left;

            if (current_slide < 0 && !$scope.slinding) {

                $scope.slinding = true;

                $(el).parent().find(".timeline li").animate({
                    'left': "+=" + width_elem + "px"
                }, 300, function () {

                    $scope.slinding = false;

                    var newEl = $(el).parent().find(".timeline li:nth-child(" + ((-current_slide/width_elem)) + ")"),
                        newMonth = newEl.attr('data-month'),
                        newYear = newEl.attr('data-year');

                    $('.historique-container .month').html(newMonth + '<span class="arrow"></span>');
                    $('.historique-container .year').html(newYear);
                });
            }

            $('.data-historique .next').css('opacity', 1);

            if(current_slide > (0 - (width_elem + 10))){
                $('.data-historique .prev').css('opacity', 0);
            }
        };

        $scope.scrollCarouselRight = function(ev){

            var el = ev.currentTarget,
                total = $(".historique-container .timeline li").length,
                width_elem = $(el).parent().find(".timeline li").first().width(),
                width_total = $(el).parent().find(".timeline").width(),
                current_slide = $(el).parent().find(".timeline li").first().position().left;

            if ((width_total - current_slide) < total * width_elem && !$scope.slinding){

                $scope.slinding = true;

                $(el).parent().find(".timeline li").animate({
                    'left': "-=" + width_elem + "px"
                }, 300, function () {
                    $scope.slinding = false;

                    var newEl = $(el).parent().find(".timeline li:nth-child(" + ((-current_slide/width_elem) + 2) + ")"),

                        newMonth = newEl.attr('data-month'),
                        newYear = newEl.attr('data-year');

                    $('.historique-container .month').html(newMonth + '<span class="arrow"></span>');
                    $('.historique-container .year').html(newYear);
                });
            }

            $('.data-historique .prev').css('opacity', 1);

            if(((width_total - current_slide) + width_elem) >= total * width_elem) {
                $('.data-historique .next').css('opacity', 0);
            }
        };

        $scope.checkPopupCookie = function(){

            if(!DashboardService.getLessonCookie()){

                DashboardService.setLessonCookie();

                var lastWeekStartDate = moment().startOf('week').isoWeekday(1).format('MM/DD/YYYY'),
                    lastWeekEndDate = moment().endOf('week').isoWeekday(1).format('MM/DD/YYYY');

                DashboardService.getLessonID(lastWeekStartDate, lastWeekEndDate).then(function(id){
                    $scope.firePopup(id);
                });
            }

        };

        $scope.firePopup = function(id){
            var el = angular.element(document.querySelector('popup')),
                _id = id ? id : false;

            el.scope().init(_id);
        };

        var view_port = $(window).width(),
            display = 4;

        $scope.slinding = false;

        if (view_port < 749) {

            var $li = $(".timeline li.current"),
                position = $li.attr('data-position'),
                width_elem = $(".timeline li").first().width(),
                half_width = width_elem / 2;

            if (position > 2) {
                $(".timeline li").css('left', -(position - 1) * width_elem + half_width);
            }

        } else {

            if (view_port < 1179) {
                display = 3;
            }

            var $li = $(".timeline li.current"),
                position = $li.attr('data-position'),
                width_elem = $(".timeline li").first().width();

            if (position > 3) {
                $(".timeline li").css('left', -(position - display + 1) * width_elem);
            }
        }

        if(!$rootScope.noDevice && !$rootScope.noData) $scope.getSummaryData(false);

    }]);
})();