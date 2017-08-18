(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationAddAnimalSubTypeCtrl", systemConfigurationAddAnimalSubTypeCtrl);

  /** @ngInject */
  function systemConfigurationAddAnimalSubTypeCtrl($scope, manageFactory, adminFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.animalType={};
    model.animalSubType={};
    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListAnimalSubTypes',{
        animalType: model.animalType,
        animalTypeId: model.animalType.id
      });
    }

    getAnimalTypeParam().then(function (data) {
      model.animalType = data;
      getAnimalSubTypes();
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

    model.addAnimalSubType = function () {
      model.animalSubType.parentType=model.animalType.id;
      adminFactory.addAnimalSubType(model.animalSubType).then(
        function (data) {
          if (data == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Animal sub type added successfully!')
            );
            model.cancel();
          }
        }
      ).catch(function (data) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('There was an error saving the animal sub type, please try again!')
        );
      });
    };


  }
}());
