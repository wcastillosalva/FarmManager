(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("removePlantTypeDialogCtrl", removePlantTypeDialogCtrl);

  /** @ngInject */
  function removePlantTypeDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;

    model.plantType = locals.plantType;
    //model.farm = locals.farm;
    model.yes = function () {
      adminFactory.deletePlantType(model.plantType).then(function(data){
        $mdToast.show(
          $mdToast.simple()
          .textContent('Plant type removed successfully!')
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
