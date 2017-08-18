(function () {
  'use strict';
  var app = angular.module('app.farmmanager');

  app.directive("angularMaterialPaging", angularMaterialPaging);

  function angularMaterialPaging() {
    return {
      restrict: 'EA',
      scope: {
        wmpTotal: '=',
        position: '@',
        gotoPage: '&',
        step: '=',
        currentPage: '='
      },
      controller: function ($scope) {
        var vm = this;
        vm.totalPages = $scope.wmpTotal / 10;
        vm.first = '<<';
        vm.last = '>>';
        vm.index = 0;
        vm.step = $scope.step;

        vm.goto = function (index) {
          $scope.currentPage = vm.page[index];
        };

        vm.getoPre = function () {
          $scope.currentPage = vm.index;
          vm.index -= vm.step;
        };

        vm.getoNext = function () {
          vm.index += vm.step;
          $scope.currentPage = vm.index + 1;
        };

        vm.gotoFirst = function () {
          vm.index = 0;
          $scope.currentPage = 1;
        };

        vm.gotoLast = function () {
          vm.index = parseInt(vm.totalPages / vm.step) * vm.step;
          vm.index === vm.totalPages ? vm.index = vm.index - vm.step : '';
          $scope.currentPage = vm.totalPages;
        };

        $scope.$watch('currentPage', function () {
          $scope.gotoPage();
        });

        $scope.$watch('wmpTotal', function () {
          vm.totalPages = Math.floor($scope.wmpTotal / 10);
          if ($scope.wmpTotal % 10 != 0)
          vm.totalPages++;
          vm.init();
        });

        vm.init = function () {
          vm.stepInfo = (function () {
            var i, result = [];
            for (i = 0; i < vm.step; i++) {
              result.push(i)
            }
            return result;
          })();
          vm.page = (function () {
            var i, result = [];
            for (i = 1; i <= vm.totalPages; i++) {
              result.push(i);
            }
            return result;
          })();

        };
      },
      controllerAs: 'vm',
      templateUrl: 'app/main/farmmanager/directives/angularMaterialPaging/angularMaterialPaging.html'
    };
  }
}());
