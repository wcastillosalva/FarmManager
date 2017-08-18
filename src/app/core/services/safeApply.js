(function () {
  'use strict';

  angular
  .module('app.core')
  .factory('safeApply', safeApply);
  /** @ngInject */
  function safeApply($rootScope, $timeout) {
    return function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if (fn) {
          $scope.$eval(fn);
        }
      } else {
        if (fn) {
          $timeout(function(){
            $scope.$apply(fn);
          });

        } else {
          $timeout(function(){
            $scope.$apply();
          });
        }
      }
    }
  }
}());
