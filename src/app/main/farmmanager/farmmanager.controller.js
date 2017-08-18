(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController($scope, adminFactory, manageFactory, localDbFactory, $mdToast, $rootScope, $state) {
        var model = this;
        model.showGrid = true;
        // Data
        model.pendingDataEnabled = false;
        model.pendingChanges = 0;
        model.pinnedAnimals={};
        model.showImmages=showImmages;
        /*
        $rootScope.$on('connectionChangeEvent', function (event, data) {
            if ($scope.refreshPendingDataMonitor) {
              refreshPendingData();
            }
        });
        */

        refreshPendingData();

        function refreshPendingData(){
            localDbFactory.getAllPendingCountLocalDb()
            .then(function(data){
              model.pendingChanges=data;
              model.pendingDataEnabled = data>0;
            }).catch(function(error){
              $mdToast.show(
                  $mdToast.simple().textContent(error)
              );
            });
        };

        model.getWidgetClass = function (value) {
            if (value == 0) {
                return 'blue-grey-fg';
            } else if (value > 0 & value <= 15) {
                return 'light-blue-fg';
            } else if (value > 15 & value <= 25) {
                return 'orange-fg';
            } else {
                return 'red-fg';
            }
        };

        model.goToPendingData = function () {
            $state.go('app.farmmanager.pendingData');
        };
        var animalTypes;
        adminFactory.getAnimalTypes()
        .then(function(data){
          angular.forEach(data,function(value,key){
            adminFactory.getAnimalSubTypes(value)
            .then(function(data){
              value.subTypes=data;
            }).catch(function(error){
              $mdToast.show(
                  $mdToast.simple().textContent(error)
              );
            });
          });
          animalTypes=data;
          model.animalTypes=data;
        }).catch(function(error){
          $mdToast.show(
              $mdToast.simple().textContent(error)
          );
        });
      
        getPinnedAnimals();
        function getPinnedAnimals(){
          manageFactory.getPinnedAnimals()
          .then(function(data){
            model.pinnedAnimals=data;
          }).catch(function(error){
            $mdToast.show(
                $mdToast.simple().textContent(error)
            );
          });
        };

        model.goToAnimal=function(animal){
          $state.go('app.farmmanager.manageAnimal', {
              farmId: animal.farm,
              animalTypeId: animal.type,
              animalId: animal.id
          });
        };
    }
})();
