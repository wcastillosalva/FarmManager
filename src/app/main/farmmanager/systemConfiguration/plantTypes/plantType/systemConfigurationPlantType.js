(function () {
  'use strict';
  var app = angular.module('app.farmmanager');
  app.controller("systemConfigurationPlantTypeCtrl", systemConfigurationPlantTypeCtrl);

  /** @ngInject */
  function systemConfigurationPlantTypeCtrl($scope, manageFactory, adminFactory, connectionFactory, $state, $stateParams, $q, $mdToast,NgMap) {
    var model = this;
    model.plantType={};
    model.cancel =function(){
      $state.go('app.farmmanager.systemConfigurationListPlantTypes');
    }

    getPlantTypeParam().then(function (data) {
      model.plantType = data;
    });

    function getPlantTypeParam() {
      var defer = $q.defer();
      if ($stateParams.plantType == null) {
        if ($stateParams.plantTypeId == '')
        model.cancel();
        else {
          adminFactory.getPlantType($stateParams.plantTypeId).then(
            function (data) {
              defer.resolve(data);
            }
          ).catch(function (error) {
            defer.reject(false);
          });
        }

      } else {
        defer.resolve($stateParams.plantType);
      }
      return defer.promise;
    };

    model.savePlantType = function () {
      if(!connectionFactory.checkOffline(false))
        return;
      adminFactory.savePlantType(model.plantType).then(
        function (data) {
          if (data == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Plant type saved successfully!')
            );
            model.cancel();
          }
        }
      ).catch(function (data) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('There was an error saving the plant type, please try again!')
        );
      });
    };


  }
}());
