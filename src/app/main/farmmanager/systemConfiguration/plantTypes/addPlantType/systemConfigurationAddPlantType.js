(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationAddPlantTypeCtrl", systemConfigurationAddPlantTypeCtrl);

  /** @ngInject */
  function systemConfigurationAddPlantTypeCtrl($scope, manageFactory, adminFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.plantType={};
    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListPlantTypes');
    }

    model.addPlantType = function () {
      adminFactory.addPlantType(model.plantType).then(
        function (data) {
          if (data == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Plant type added successfully!')
            );
            model.cancel();
          }
        }
      ).catch(function (data) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('There was an error saving the plant type, please try again!')
        );
      });
    };


  }
}());
