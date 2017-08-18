(function () {
  'use strict';

  angular
  .module('app.farmmanager')
  .factory('weatherFactory', weatherFactory);

  /** @ngInject */
  function weatherFactory($q, $http, darkSky) {
    return {
      getWeather: _getWeather
    }

    function _getWeather(latitude, longitude) {
      var defer = $q.defer();
      darkSky.getCurrent(latitude, longitude)
      .then(function (data) {
        defer.resolve(data);
      })
      .catch(function (error) {
        console.warn(error)
        defer.reject(data);
      });
      return defer.promise;
    }

  };

}());
