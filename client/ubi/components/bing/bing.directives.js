/*jshint -W099*/

/**
 * iMetric
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    /**
     * Setup of Bing Component
     *
     */
    var bingMapModule = angular.module('UBIDriver.components.bing.directives',[])

        /**
         * @function UBIDriver.components.bing.directives.ubiClusterMap
         * @memberof UBIDriver.components.bing
         * @author Alex Boisselle
         * @param {array} events - a list of events to watch
         * @param {function} fn - a common callback for each of them
         * @description lets you bind to multiple event broadcasts in a clean way with a common callback fn
         * @fires $on
         */
        .directive('ubiClusterMap', ['$rootScope',
                               'BingService',
                               'PinClusterer',
                               'PATHS', function($rootScope,
                                                 BingService,
                                                 PinClusterer,
                                                 PATHS) {

            var dir = {
                restrict: "E",
                scope: {
                    mapdata: '='
                },
                templateUrl: PATHS.BING + 'bing.view.html',
                link: function(scope, element, attr){
                    var M;

                    BingService.init().then(function(Microsoft){

                        M = Microsoft;

                        setTimeout(function() {
                            generateMap(scope);

                            //scope.$watch(function () {
                            //    return scope.mapdata;
                            //}, function (newValue, oldValue) {
                            //    generateMap(scope);
                            //});
                        }, 3000);
                    });

                    scope.$watch('mapdata', function(){
                        generateMap(scope);
                    });
                }
            };

            function generateMap(scope){

                //Bing has some timing issues especially when dealing with data-bound scopes in angular so we must check here to make sure scope has updated
                if(scope.mapdata){
                    var map = new BingService.Microsoft.Maps.Map(document.getElementById('mapDiv'), {
                        credentials: "Am-t_QYeujX69conFlHEyWMZDjVoe7M0jYDsK8UdWwRO5WMW83zV1DWH9DrUUAjQ",
                        center: new BingService.Microsoft.Maps.Location(scope.mapdata[0].latitude, scope.mapdata[0].longitude),
                        mapTypeId: BingService.Microsoft.Maps.MapTypeId.road,
                        zoom: 8
                    });

                    BingService.Microsoft.Maps.Events.addHandler(map, 'mousewheel', function(e) {
                        e.handled = true;
                        return true;
                    });

                    //init cluster module on map and data
                    var pinClusterer = new PinClusterer(map);
                    pinClusterer.cluster(scope.mapdata);

                    BingService.map = pinClusterer;
                }
            }

            return dir;
        }]);
})();