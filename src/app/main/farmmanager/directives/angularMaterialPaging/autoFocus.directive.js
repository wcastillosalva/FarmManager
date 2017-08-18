(function () {
  'use strict';
  var app = angular.module('app.farmmanager');

  app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
      //scope: true,   // optionally create a child scope
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function (value) {          
          if (value === true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function () {
          console.log('blur');
          scope.$apply(model.assign(scope, false));
        });
      }
    };
  }]);

}());
