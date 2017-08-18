(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("removeFarmDialogCtrl", removeFarmDialogCtrl);

  /** @ngInject */
  function removeFarmDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;

    model.farm = locals.farm;
    //model.farm = locals.farm;
    model.yes = function () {
      adminFactory.deleteFarm(model.farm).then(function(data){
        $mdToast.show(
          $mdToast.simple()
          .textContent('Farm removed successfully!')
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
