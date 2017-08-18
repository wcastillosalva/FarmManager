(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("removeAnimalTypeDialogCtrl", removeAnimalTypeDialogCtrl);

  /** @ngInject */
  function removeAnimalTypeDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;

    model.animalType = locals.animalType;
    //model.farm = locals.farm;
    model.yes = function () {
      adminFactory.deleteAnimalType(model.animalType).then(function(data){
        $mdToast.show(
          $mdToast.simple()
          .textContent('Animal type removed successfully!')
        );
        $mdDialog.hide(true);
      }).catch(function(error){
        $mdToast.show(
          $mdToast.simple()
          .textContent(error.message)
        );
      });
    };

    model.no = function () {
      $mdDialog.cancel();
    };
  }
}());
