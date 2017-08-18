(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("manageAnimalTypesInFarmDialogCtrl", manageAnimalTypesInFarmDialogCtrl);

  /** @ngInject */
  function manageAnimalTypesInFarmDialogCtrl($scope, adminFactory, manageFactory, locals, $mdDialog, $mdToast) {
    var model = this;
    model.farm=locals.farm;
    model.animalTypes=[];
    getAnimalTypes();

    function getAnimalTypes(){
      adminFactory.getAnimalTypesForFarm(model.farm, true).then(
        function (data) {
          model.animalTypes = data;
        }
      );
    };


    model.switch=function (animalType) {
      if(animalType.included)
      {
        adminFactory.excludeAnimalTypeInFarm(model.farm, animalType).then(
          function (data) {
            if (data == 1) {
              getAnimalTypes();
              $mdToast.show(
                $mdToast.simple()
                .textContent('Animal type excluded!')
              );
            }
          }
        );
      }
      else{
        adminFactory.includeAnimalTypeInFarm(model.farm, animalType).then(
          function (data) {
            if (data == 1) {
              getAnimalTypes();
              $mdToast.show(
                $mdToast.simple()
                .textContent('Animal type included!')
              );
            }
          }
        );
      }
    };

    model.no = function () {
      $mdDialog.cancel();
    };
  }
}());
