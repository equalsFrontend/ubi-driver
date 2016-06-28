/*jshint -W099*/

/**
 * iMetric
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var bingServices = angular.module('UBIDriver.components.bing.services', [])

    .factory('BingService', ['$q', '$rootScope', 'angularLoad', function($q, $rootScope, angularLoad){
        return {
            init: function(){

                var q = $q.defer(),
                    self = this;

                if(!this.Microsoft){

                    var prot = "http",
                        s = false;

                    if(location.host.indexOf('maifandgo.fr') > -1){
                        prot = "https";
                        s = true;
                    }

                    angularLoad.loadScript(prot + '://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0' + (s ? '&s=1': '') + '&mkt=' + $rootScope.currentLang + "-" + $rootScope.currentLang).then(function(){

                        self.Microsoft = Microsoft;

                        //console.log(Microsoft.Maps)

                        q.resolve(Microsoft);

                    }).catch(function(){
                        //error loading bing script
                    });
                } else {
                    q.resolve(Microsoft);
                }

                return q.promise;
            },
            getMicrosoft: function(){
                if(!this.Microsoft){
                    this.init().then(function(M){
                        return M;
                    }, function(){
                        return false;
                    });
                } else {
                    return this.Microsoft;
                }
            }
        };
    }])

    .factory('PinClusterer', ['$q', '$rootScope', 'BingService', 'Cluster', 'CLUSTER_CONFIG', function($q, $rootScope, BingService, Cluster, CLUSTER_CONFIG){


        // Minimum
        // level before bounds dissappear
        var MIN_ZOOM = 2,

        // Alias for Microsoft.Maps
        mm = null;

        var PinClusterer = window.PinClusterer = function (map, options) {
            this.map		 = map;
            this.options 	 = options;
            this.layer 		 = null;

            this.setOptions(this.options);
            this.doClickToZoom = CLUSTER_CONFIG.DEFAULTS.clickToZoom;

            if (BingService.Microsoft && BingService.Microsoft.Maps)	{

                // Create a shortcut
                mm = BingService.Microsoft.Maps;

                this.layer = new BingService.Microsoft.Maps.EntityCollection();
                this.map.entities.push(this.layer);
                this.loaded = true;
            }
        };

        PinClusterer.prototype = {

            cluster: function (latlongs) {
                if (!this.loaded) return;
                if (!latlongs) {
                    if (!this._latlongs) return;
                } else {
                    this._latlongs = latlongs;
                }

                var self = this;
                if (this._viewchangeendHandler) {
                    this._redraw();
                } else {
                    this._viewchangeendHandler = BingService.Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', function() { self._redraw(); });
                }
            },

            _redraw: function () {

                if (CLUSTER_CONFIG.DEFAULTS.debug) var started = new Date();

                if (!this._latlongs) return;

                this._metersPerPixel  = this.map.getMetersPerPixel();
                this._bounds 		  = this.getExpandedBounds(this.map.getBounds(), CLUSTER_CONFIG.DEFAULTS.extendMapBoundsBy);
                this._zoom 			  = this.map.getZoom();
                this._clusters 		  = [];
                this.doClickToZoom 	  = true;
                this.mixed            = false;

                this.layer.clear();

                this.each(this._latlongs, this._addToClosestCluster);

                this.toMap();

                if (CLUSTER_CONFIG.DEFAULTS.debug && started) _log((new Date()) - started);
            },

            //in this function we have access to the data's properties so we can set options of the cluster here
            _addToClosestCluster: function (latlong) {

                var distance        = 40000,
                    location        = new BingService.Microsoft.Maps.Location(latlong.latitude, latlong.longitude),
                    clusterToAddTo 	= null,
                    type            = latlong.type,
                    info            = latlong.info, d,
                    point = {
                        info: info,
                        location: location,
                        type: type
                    };

                this.type = point.type;

                if (this._zoom > MIN_ZOOM && !this._bounds.contains(location)) return;

                if (this._zoom >= CLUSTER_CONFIG.DEFAULTS.maxZoom) {
                    this.doClickToZoom = true;
                    this._createCluster(point);
                    return;
                }

                this.each(this._clusters, function (cluster) {
                    d = this._distanceToPixel(cluster.center.location, location);
                    if (d < distance) {
                        distance = d;
                        clusterToAddTo = cluster;
                    }
                });

                if (clusterToAddTo && clusterToAddTo.containsWithinBorders(location)) {
                    clusterToAddTo.add(point);
                } else {
                    this._createCluster(point);
                }
            },

            _createCluster: function (point) {
                var cluster = new Cluster(this, point, this.map);
                cluster.add(point);
                this._clusters.push(cluster);
            },

            setOptions: function (options) {
                for (var opt in options)
                    if (typeof CLUSTER_CONFIG.DEFAULTS[opt] !== 'undefined') CLUSTER_CONFIG.DEFAULTS[opt] = options[opt];
            },

            toMap: function () {
                this.each(this._clusters, function (cluster) {
                    cluster.toMap();
                });
            },

            getExpandedBounds: function (bounds, gridFactor) {
                var northWest = this.map.tryLocationToPixel(bounds.getNorthwest()),
                    southEast = this.map.tryLocationToPixel(bounds.getSoutheast()),
                    size 	  = gridFactor ? CLUSTER_CONFIG.DEFAULTS.gridSize * gridFactor : CLUSTER_CONFIG.DEFAULTS.gridSize / 2;

                if (northWest && southEast) {
                    northWest = this.map.tryPixelToLocation(new BingService.Microsoft.Maps.Point(northWest.x - size, northWest.y - size));
                    southEast = this.map.tryPixelToLocation(new BingService.Microsoft.Maps.Point(southEast.x + size, southEast.y + size));
                    if (northWest && southEast) {
                        bounds = BingService.Microsoft.Maps.LocationRect.fromCorners(northWest, southEast);
                    }
                }

                return bounds;
            },

            _distanceToPixel: function (l1, l2) {
                return PinClusterer.distance(l1, l2) * 1000 / this._metersPerPixel;
            },

            each: function (items, fn) {
                if (!items.length) return;
                for (var i = 0, item; item = items[i]; i++) {
                    var rslt = fn.apply(this, [item, i]);
                    if (rslt === false) break;
                }
            }

        };

        PinClusterer.distance = function(p1, p2) {
            if (!p1 || !p2) return 0;
            var R  	  = 6371, // Radius of the Earth in km
                pi180 = Math.PI / 180,
                dLat  = (p2.latitude - p1.latitude) * pi180,
                dLon  = (p2.longitude - p1.longitude) * pi180,
                a 	  = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                    + Math.cos(p1.latitude * pi180) * Math.cos(p2.latitude * pi180)
                    * Math.sin(dLon / 2) * Math.sin(dLon / 2),
                c 	  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
                d 	  = R * c;
            return d;
        };

        return PinClusterer;
    }])

    .factory('Cluster', ['$q', '$rootScope', 'BingService', 'Pin', 'CLUSTER_CONFIG', function($q, $rootScope, BingService, Pin, CLUSTER_CONFIG){

        var Cluster = function (pinClusterer, point, map) {
            this._pinClusterer 	= pinClusterer;
            this.locations 	    = [];
            this.points         = [];
            this.center		    = null;
            this._bounds	    = null;
            this.length		    = 0;
            this.type           = point.type;
            this.types          = [];
            this.mixed          = false;
            this.map            = map,
            this.doClickToZoom	= this._pinClusterer.doClickToZoom;
        };

        Cluster.prototype = {
            add: function (point){

                if (this._alreadyAdded(point.location)) return;

                //within the cluster, if a point of a different type
                //has been added, flag that it's a mixed cluster
                if(this.currentType){
                    if(this.currentType != point.type) {
                        this.mixed = true;
                        this.types.push(point.type);
                    }
                } else {
                    this.types.push(point.type);
                }

                this.currentType = point.type;

                this.locations.push(point.location);
                this.points.push(point);

                this.length += 1;

                if (!this.center) {
                    this.center = new Pin(point, this, this.options, this.map);
                    this._calculateBounds();
                }

            },

            connectPoints: function (locations) {
                this.map.entities.push(this.line);
            },

            containsWithinBorders: function (location) {
                if (this._bounds) return this._bounds.contains(location);
                return false;
            },

            zoom: function () {
                var currentZoom = this.map.getZoom(),
                    maxZoom = CLUSTER_CONFIG.DEFAULTS.maxZoom,
                    newZoom;

                if(currentZoom == maxZoom){
                    newZoom = currentZoom;
                } else if(currentZoom < maxZoom){
                    newZoom = currentZoom + 1;
                }

                this._pinClusterer.map.setView({
                    center: this.center.location, zoom: newZoom
                });
            },

            _alreadyAdded: function (location) {
                if (this.locations.indexOf) {
                    return this.locations.indexOf(location) > -1;
                } else {
                    for (var i = 0, l; l = this.locations[i]; i++) {
                        if (l === location) return true;
                    }
                }
                return false;
            },

            _calculateBounds: function () {
                var bounds = BingService.Microsoft.Maps.LocationRect.fromLocations(this.center.location);
                this._bounds = this._pinClusterer.getExpandedBounds(bounds);
            },

            toMap: function () {
                this._updateCenter();
                this.center.toMap(this._pinClusterer.layer);

                //var line = new Microsoft.Maps.Polyline(this.locations);
                //this._pinClusterer.layer.push(line);

                if (!CLUSTER_CONFIG.DEFAULTS.debug) return;

                var north = this._bounds.getNorth(),
                    east		= this._bounds.getEast(),
                    west		= this._bounds.getWest(),
                    south		= this._bounds.getSouth(),
                    nw 			= new BingService.Microsoft.Maps.Location(north, west),
                    se 			= new BingService.Microsoft.Maps.Location(south, east),
                    ne 			= new BingService.Microsoft.Maps.Location(north, east),
                    sw 			= new BingService.Microsoft.Maps.Location(south, west),
                    color 	    = new BingService.Microsoft.Maps.Color(100, 100, 0, 100),
                    poly 		= new BingService.Microsoft.Maps.Polygon([nw, ne, se, sw], { fillColor: color, strokeColor: color, strokeThickness: 1 });
                this._pinClusterer.layer.push(poly);
            },

            _updateCenter: function () {

                var count 	    = this.locations.length,
                    text 		= '',
                    typeName 	= CLUSTER_CONFIG.DEFAULTS.pinTypeName + " " + this.type,
                    index       = 0;

                if (count > 1) {
                    text += count;
                    if(this.mixed) {
                        typeName = CLUSTER_CONFIG.DEFAULTS.clusterTypeName + " mixed";
                    } else {
                        typeName = CLUSTER_CONFIG.DEFAULTS.clusterTypeName + " " + this.type;
                    }

                    if(count > 100) {
                        typeName += " large";
                    }
                    if(count < 100 && count > 10) {
                        typeName += " medium";
                    }
                    if(count <= 10) {
                        typeName += " small";
                    }
                } else {
                    //console.info(this);
                }

                this.center.pushpin.setOptions({
                    text			: text,
                    typeName	: typeName
                });

                if (CLUSTER_CONFIG.DEFAULTS.onClusterToMap) {
                    CLUSTER_CONFIG.DEFAULTS.onClusterToMap.apply(this._pinClusterer, [this.center.pushpin, this]);
                }
            }
        };

        return Cluster;
    }])

    .factory('Pin', ['$q', '$rootScope', 'BingService', 'CLUSTER_CONFIG', function($q, $rootScope, BingService, CLUSTER_CONFIG){
        var Pin = function (point, cluster, options, map) {
            this.location = point.location;
            this._cluster = cluster,
            this.id       = Math.floor((Math.random() * 1000000) + 1);
            this.map      = map;

            // The default options of the pushpin showing at the centre of the cluster
            // Override within onClusterToMap function

            this._options 					= options || {};
            this._options.typeName 		    = this._options.typeName || CLUSTER_CONFIG.DEFAULTS.pinTypeName;
            this._options.height 			= CLUSTER_CONFIG.DEFAULTS.pinSize;
            this._options.width 			= CLUSTER_CONFIG.DEFAULTS.pinSize;
            this._options.anchor 			= new BingService.Microsoft.Maps.Point(CLUSTER_CONFIG.DEFAULTS.pinSize / 2, CLUSTER_CONFIG.DEFAULTS.pinSize / 2);
            this._options.textOffset 	    = new BingService.Microsoft.Maps.Point(0, 2);
            this._options.title             = point.info.title;
            this._options.description       = point.info.date;
            this._options.stats             = point.info.stats;
            this._create();
        };

        Pin.prototype = {
            _create: function () {
                var self = this;

                this.pushpin  = new BingService.Microsoft.Maps.Pushpin(this.location, this._options);

                var infoboxOptions = {
                    width: 170,
                    height: 80,
                    zIndex: 10,
                    id: 'infobox-' + self.id,
                    offset: new Microsoft.Maps.Point(0, 53),
                    showCloseButton: true,
                    showPointer: true,
                    //htmlContent: BingMap.generateInfoBox(),
                    title: this._options.title,
                    description: this._options.description,
                    visible: false
                };

                //should only add this on click, mmust be destroyed after as well
                this.infobox = new BingService.Microsoft.Maps.Infobox(this.location, infoboxOptions);
                this.map.entities.push(this.infobox);

                //console.info(this);

                BingService.Microsoft.Maps.Events.addHandler(this.pushpin, 'click', function (e) {
                    if(e.target._typeName.indexOf(' pin ') > 0) {
                        //console.info('accel or brake');

                        if(BingService.currentInfoBox){
                            BingService.currentInfoBox.setOptions({visible: false});
                        }

                        self.infobox.setOptions({visible: true});
                        BingService.currentInfoBox = self.infobox;

                    } else {
                        self._cluster.zoom();
                    }
                });
            },

            toMap: function (layer) {
                layer.push(this.pushpin);
            }
        };

        return Pin;
    }]);
})();