(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("managePlantTypesInFarmDialogCtrl", managePlantTypesInFarmDialogCtrl);

  /** @ngInject */
  function managePlantTypesInFarmDialogCtrl($scope, adminFactory, manageFactory, locals, $mdDialog, $mdToast) {
    var model = this;
    model.farm=locals.farm;
    model.plantTypes=[];
    getPlantTypes();

    function getPlantTypes(){
      adminFactory.getPlantTypesForFarm(model.farm, true).then(
        function (data) {
          model.plantTypes = data;          
        }
      );
    };


    model.switch=function (plantType) {
      if(plantType.included)
      {
        adminFactory.excludePlantTypeInFarm(model.farm, plantType).then(
          function (data) {
            if (data == 1) {
              getPlantTypes();
              $mdToast.show(
                $mdToast.simple()
                .textContent('Plant type excluded!')
              );
            }
          }
        );
      }
      else{
        adminFactory.includePlantTypeInFarm(model.farm, plantType).then(
          function (data) {
            if (data == 1) {
              getPlantTypes();
              $mdToast.show(
                $mdToast.simple()
                .textContent('Plant type included!')
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
