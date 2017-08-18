(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("removeAnimalSubTypeDialogCtrl", removeAnimalSubTypeDialogCtrl);

  /** @ngInject */
  function removeAnimalSubTypeDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;

    model.animalSubType = locals.animalSubType;
    //model.farm = locals.farm;
    model.yes = function () {
      adminFactory.deleteAnimalSubType(model.animalSubType).then(function(data){
        $mdToast.show(
          $mdToast.simple()
          .textContent('Animal sub type removed successfully!')
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
