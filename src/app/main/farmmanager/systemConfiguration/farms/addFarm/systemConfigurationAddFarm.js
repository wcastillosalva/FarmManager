(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationAddFarmCtrl", systemConfigurationAddFarmCtrl);

  /** @ngInject */
  function systemConfigurationAddFarmCtrl($scope,manageFactory, adminFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.farm={};
    model.centerChanged = function (event) {
      NgMap.getMap().then(function (map) {
        model.center = map.getCenter();
      });
    };

    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListFarms');
    }

    model.saveFarm = function () {
      var newFarm = model.farm;
      NgMap.getMap().then(function (map) {
        model.map = map;
        newFarm.map = map.getCenter().lat() + "," + map.getCenter().lng();
        adminFactory.addFarm(newFarm).then(
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
