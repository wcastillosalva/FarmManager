(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("sellAnimalDialogCtrl", sellAnimalDialogCtrl);

  /** @ngInject */
  function sellAnimalDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;

    model.animal = locals.animal;
    //model.farm = locals.farm;
    model.yes = function () {
      manageFactory.sellAnimal(model.animal)
      .then(function (data) {
        if (data == 1) {
          $mdToast.show(
            $mdToast.simple().textContent('Animal sold successfully!')
          );
          $mdDialog.hide(true);
        }
      }).catch(function (error) {
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
