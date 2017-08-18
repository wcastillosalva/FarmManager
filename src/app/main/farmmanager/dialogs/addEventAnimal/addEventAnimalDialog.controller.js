(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("addEventAnimalDialogCtrl", addEventAnimalDialogCtrl);

  /** @ngInject */
  function addEventAnimalDialogCtrl($scope, manageFactory, adminFactory, locals, $mdDialog, $mdToast, $filter) {
    var model = this;
    model.event = {
      type: 'User',
      message: '',
      date: ''
    };
    model.animal = locals.animal;
    model.farm = locals.farm;
    //model.farm = locals.farm;
    model.ok = function () {
      if (model.event.message != '' && model.event.date) {
        model.event.date = $filter('date')(model.event.date, 'yyyy-MM-ddTHH:mm:ss');
        manageFactory.addEventToAnimal(model.animal, model.event)
        .then(function (data) {
            if (data == 1) {
              $mdToast.show(
                $mdToast.simple().textContent('Animal event added successfully!')
              );
              $mdDialog.hide(true);
            }
          }).catch(function(error){
            $mdToast.show(
              $mdToast.simple().textContent(error)
            );
          });
      } else {
        $mdToast.show(
          $mdToast.simple().textContent('Plese check your event information!')
        );
      }
    };

    model.cancel = function () {
      $mdDialog.cancel();
    };
  }
}());
