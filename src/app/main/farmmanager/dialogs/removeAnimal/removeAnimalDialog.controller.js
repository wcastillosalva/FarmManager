(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("removeAnimalDialogCtrl", removeAnimalDialogCtrl);

  /** @ngInject */
  function removeAnimalDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast) {
    var model = this;
    model.farms = [];
    model.animal = locals.animal;
    model.removedReasonsCatalog = [];
    model.reasonText = '';
    manageFactory.getRemovedReasonAnimalCatalog().then(function (data) {
      model.removedReasonsCatalog = data;
    }).catch(function (error) {

    });
    model.ok = function () {
      if (model.selectedReason != undefined) {
        model.selectedReason.reasonText = model.reasonText;
        manageFactory.removeAnimal(model.animal, model.selectedReason)
        .then(function (data) {
          if (data == 1) {
            $mdToast.show(
              $mdToast.simple().textContent('Animal removed successfully, reason: ' + model.selectedReason.name + '!')
            );
            $mdDialog.hide(true);
          }
        }).catch(function (error) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(error.message)
          );
        });
      } else {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Please select the reason to remove the animal!')
        );
      }
    };

    model.cancel = function () {
      $mdDialog.cancel();
    };
  }
}());
