(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationAnimalSubTypeCtrl", systemConfigurationAnimalSubTypeCtrl);

  /** @ngInject */
  function systemConfigurationAnimalSubTypeCtrl($scope, manageFactory, adminFactory, connectionFactory, $state, $stateParams, $q, $mdToast) {
    var model = this;
    model.animalType={};
    model.animalSubType={};
    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListAnimalSubTypes',{
        animalType:model.animalType,
        animalTypeId:model.animalType.id,
      });
    }

    getAnimalTypeParam().then(function (data) {
      model.animalType = data;
      getAnimalSubTypeParam().then(function (data) {
        model.animalSubType = data;
      });
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



    function getAnimalSubTypeParam() {
      var defer = $q.defer();
      if ($stateParams.animalSubType == null) {
        if ($stateParams.animalSubTypeId == '')
        model.cancel();
        else {
          adminFactory.getAnimalSubType($stateParams.animalSubTypeId).then(
            function (data) {
              defer.resolve(data);
            }
          ).catch(function (error) {
            defer.reject(false);
          });
        }

      } else {
        defer.resolve($stateParams.animalSubType);
      }
      return defer.promise;
    };

    model.saveAnimalSubType = function () {
      if(!connectionFactory.checkOffline(false))
        return;
      adminFactory.saveAnimalSubType(model.animalSubType).then(
        function (data) {
          if (data == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Animal sub type saved successfully!')
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
