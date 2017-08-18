(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationFarmCtrl", systemConfigurationFarmCtrl);

  /** @ngInject */
  function systemConfigurationFarmCtrl($scope, manageFactory, adminFactory, connectionFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.farm={};
    model.conected=$scope.connected;
    model.centerChanged = function (event) {
      NgMap.getMap().then(function (map) {
        model.center = map.getCenter();
      });
    };

    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListFarms');
    }

    getFarmParam().then(function (data) {
      model.farm = data;
    });

    function getFarmParam() {
      var defer = $q.defer();
      if ($stateParams.farm == null) {
        if ($stateParams.farmId == '')
        model.cancel();
        else {
          adminFactory.getFarm($stateParams.farmId).then(
            function (data) {
              defer.resolve(data);
            }
          ).catch(function (error) {
            defer.reject(false);
          });
        }

      } else {
        defer.resolve($stateParams.farm);
      }
      return defer.promise;
    }

    model.saveFarm = function () {
      if(!connectionFactory.checkOffline(false))
        return;
      var newFarm = model.farm;
      NgMap.getMap().then(function (map) {
        model.map = map;
        newFarm.map = map.getCenter().lat() + "," + map.getCenter().lng();
        adminFactory.saveFarm(newFarm).then(
          function (data) {
            if (data == true) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Farm added successfully!')
              );
              model.cancel();
            }
          }
        ).catch(function (data) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('There was an error saving the farm, please try again!')
          );
        });
      });
    };


  }
}());
