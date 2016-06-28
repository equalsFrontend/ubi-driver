/*jshint -W099*/
/**
 * iMetric
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var bingControllers = angular.module('UBIDriver.components.bing.controllers', [])

    .controller("BingDirectiveController", ["$scope",
                                  "$rootScope",
                                  "$state",
                                  function($scope,
                                           $rootScope,
                                           $state){

        $scope.text = "Distance Travelled";

    }]);
})();