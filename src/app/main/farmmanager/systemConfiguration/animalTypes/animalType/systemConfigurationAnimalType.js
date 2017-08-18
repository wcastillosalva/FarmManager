(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationAnimalTypeCtrl", systemConfigurationAnimalTypeCtrl);

  /** @ngInject */
  function systemConfigurationAnimalTypeCtrl($scope, manageFactory, adminFactory,connectionFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.animalType={};
    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListAnimalTypes');
    }

    getAnimalTypeParam().then(function (data) {
      model.animalType = data;
    });

    function getAnimalTypeParam() {
      var defer = $q.defer();
      if ($stateParams.animalType == null) {
        if ($stateParams.animalTypeId == '')
        model.cancel();
        else {
          adminFactory.getAnimalType($stateParams.animalTypeId).then(
            function (data) {
              defer.resolve(data);
            }
          ).catch(function (error) {
            defer.reject(false);
          });
        }

      } else {
        defer.resolve($stateParams.animalType);
      }
      return defer.promise;
    };

    model.saveAnimalType = function () {
      if(!connectionFactory.checkOffline(false))
        return;
      adminFactory.saveAnimalType(model.animalType).then(
        function (data) {
          if (data == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Animal type saved successfully!')
            );
            model.cancel();
          }
        }
      ).catch(function (data) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('There was an error saving the animal type, please try again!')
        );
      });
    };


  }
}());
