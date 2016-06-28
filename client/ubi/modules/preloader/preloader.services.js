/*jshint -W099*/

/**
 * iMetric
 * @module preloader/services
 * @author Alex Boisselle
 */

(function(){

    "use strict";

    var perloaderServices = angular.module('UBIDriver.modules.preloader.services', [])

    /**
     * @constructor PreloaderService
     * @memberOf module:preloader/services
     */
    .factory('PreloaderService', ['$q', '$http', '$rootScope', 'PATHS', function($q, $http, $rootScope, PATHS){
        return {

            /**
             * @function getLanguageFile
             * @author Alex Boisselle
             * @memberOf module:preloader/services.PreloaderService
             * @description gets language file from root/lang depending on local storage lang var
             * @returns {object} data
             */
            getLanguageFile: function() {

                var q  = $q.defer(),
                    self       = this,
                    url        = PATHS.LANG + $rootScope.currentLang + ".json";

                $http.get(url)
                .success(function(data, status, headers, config){

                    q.resolve(data);

                })
                .error(function(data, status, headers, config){

                    q.reject(status);

                });

                return q.promise;
            }
        };
    }]);
})();