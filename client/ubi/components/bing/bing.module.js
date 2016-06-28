/*jshint -W099*/

/**
 * iMetric
 * @module components/bing
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    /**
     * Setup of Bing Component
     *
     */
    var bingMapModule = angular.module('UBIDriver.components.bing',[
        'UBIDriver.components.bing.directives',
        'UBIDriver.components.bing.services',
        'UBIDriver.components.bing.controllers'
    ])

    .constant('CLUSTER_CONFIG', (function(){
        return {
            "DEFAULTS": {
                debug				: false,
                pinTypeName			: 'pin_clusterer pin',
                clusterTypeName		: 'pin_clusterer cluster',
                pinSize				: 44,
                extendMapBoundsBy	: 2,
                gridSize			: 80,
                maxZoom				: 16,
                clickToZoom			: true,
                onClusterToMap		: null,
                icon                : 'images/cluster-group.png'
            }
        };
    })());
})();