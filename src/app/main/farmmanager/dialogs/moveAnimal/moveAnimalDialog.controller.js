(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("moveAnimalDialogCtrl", moveAnimalDialogCtrl);

  /** @ngInject */
  function moveAnimalDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;
    model.farms = [];
    model.animal = locals.animal;
    model.farm = locals.farm;
    adminFactory.getFarms().then(
      function (data) {
        angular.forEach(data, function (value, key) {
          if (value.id != model.farm.id)
          model.farms.push(value);
        });
      }
    );
    model.ok = function () {
      if (model.selectedFarm != undefined) {
        adminFactory.checkAnimalTypeInFarm(model.farm,model.animal.type)
        .then(function(data){
          manageFactory.moveAnimal(model.farm, model.selectedFarm, model.animal)
          .then(function (data) {
            if (data == 1) {
              $mdToast.show(
                $mdToast.simple().textContent('Animal moved successfully to farm ' + model.selectedFarm.name + '!')
              );
              $mdDialog.hide(true);
            }
          }).catch(function (error) {
            $mdToast.show(
              $mdToast.simple().textContent(error.message)
            );
          });
        }).catch(function(error){
          $mdToast.show(
            $mdToast.simple().textContent(error.message)
          );
        });

      } else {
        $mdToast.show(
          $mdToast.simple().textContent('Please select the farm to move the animal!')
        );
      }

    };

    model.cancel = function () {
      $mdDialog.cancel();
    };
  }
}());
