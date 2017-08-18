(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationAddAnimalTypeCtrl", systemConfigurationAddAnimalTypeCtrl);

  /** @ngInject */
  function systemConfigurationAddAnimalTypeCtrl($scope, manageFactory, adminFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.animalType={};
    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListAnimalTypes');
    }

    model.addAnimalType = function () {
      adminFactory.addAnimalType(model.animalType).then(
        function (data) {
          if (data == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Animal type added successfully!')
            );
            model.cancel();
          }
        }
      ).catch(function (data) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('There was an error saving the animal type, please try again!')
        );
      });
    };


  }
}());
