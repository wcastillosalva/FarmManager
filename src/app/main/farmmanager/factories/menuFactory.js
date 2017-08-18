(function () {
  'use strict';

  angular
  .module('app.farmmanager')
  .factory('menuFactory', menuFactory);

  /** @ngInject */
  function menuFactory($q, adminFactory, msNavigationService) {
    var _builded=false;
    return {
      buildMenu: _buildMenu
    }

    function getPlantTypesForFarm(farm){
      var defer = $q.defer();
      adminFactory.getPlantTypesForFarm(farm)
      .then(function (data) {
        var i=1;
        angular.forEach(data, function (value, key) {
          msNavigationService.saveItem('fuse.farmmanager.manageListFarms.'+ farm.id+'.'+value.id, {
            title: value.type,
            icon: 'icon-pine-tree',
            state: 'app.farmmanager.manageListPlants',
            stateParams: {
              'farm': farm,
              'farmId': farm.id,
              'plantType': value,
              'plantTypeId': value.id
            },
            weight: i
          });
          i++;
        });
        defer.resolve(true);
      }).catch(function(error){
        defer.resolve(false);
      });
      return defer.promise;
    };

    function getAnimalTypesForFarm(farm){
      var defer = $q.defer();
      adminFactory.getAnimalTypesForFarm(farm)
      .then(function (data) {
        var i=1;
        angular.forEach(data, function (value, key) {
          msNavigationService.saveItem('fuse.farmmanager.manageListFarms.'+ farm.id+'.'+value.id, {
            title: value.type,
            icon: 'icon-cow',
            state: 'app.farmmanager.manageListAnimals',
            stateParams: {
              'farm': farm,
              'farmId': farm.id,
              'animalType': value,
              'animalTypeId': value.id
            },
            weight: i
          });
          i++;
        });
        defer.resolve(true);
      }).catch(function(error){
        defer.resolve(false);
      });
      return defer.promise;
    };

    function _buildMenu(latitude, longitude) {
      var defer = $q.defer();
      if(!_builded){
        msNavigationService.saveItem('fuse.farmmanager', {
          title: 'Farm Manager',
          icon: 'icon-tile-four',
          translate: 'FARM MANAGER',
          weight: 1
        });

        msNavigationService.saveItem('fuse.farmmanager.home', {
          title: 'Home',
          icon: 'icon-tile-four',
          state: 'app.farmmanager',
          translate: 'FARMMANAGER.MENU.HOME',
          weight: 1
        });

        msNavigationService.saveItem('fuse.farmmanager.manageListFarms', {
          title: 'Manage Farms',
          icon: 'icon-tile-four',
          state: 'app.farmmanager.manageListFarms',
          translate: 'FARMMANAGER.MENU.MY_FARMS',
          weight: 2
        });

        msNavigationService.saveItem('fuse.farmmanager.systemConfiguration', {
          title: 'System Configuration',
          icon: 'icon-cog',
          translate: 'FARMMANAGER.MENU.CONFIGURATION',
          weight: 3
        });

        msNavigationService.saveItem('fuse.farmmanager.pendingData', {
          title: 'Pending Data',
          icon: 'icon-sync',
          state: 'app.farmmanager.pendingData',
          translate: 'FARMMANAGER.MENU.PENDING_DATA',
          weight: 4
        });

        msNavigationService.saveItem('fuse.farmmanager.systemConfiguration.listFarms', {
          title: 'Farms',
          icon: 'icon-tile-four',
          state: 'app.farmmanager.systemConfigurationListFarms',
          translate: 'FARMMANAGER.MENU.CONFIG.FARMS',
          weight: 1
        });


        msNavigationService.saveItem('fuse.farmmanager.systemConfiguration.listAnimalTypes', {
          title: 'Animal Types',
          icon: 'icon-cow',
          state: 'app.farmmanager.systemConfigurationListAnimalTypes',
          translate: 'FARMMANAGER.MENU.CONFIG.ANIMAL_TYPES',
          weight: 2
        });

        msNavigationService.saveItem('fuse.farmmanager.systemConfiguration.listPlantTypes', {
          title: 'Plant Types',
          icon: 'icon-pine-tree',
          state: 'app.farmmanager.systemConfigurationListPlantTypes',
          translate: 'FARMMANAGER.MENU.CONFIG.PLANT_TYPES',
          weight: 3
        });

        adminFactory.getFarms().then(function(farms){
          var i=1;
          angular.forEach(farms, function (value, key) {
            msNavigationService.saveItem('fuse.farmmanager.manageListFarms.'+ value.id, {
              title: value.name,
              icon: 'icon-home',
              state: 'app.farmmanager.manageFarm',
              stateParams: {
                'farm': value,
                'id': value.id
              },
              //translate: value.name,
              weight: i
            });
            getAnimalTypesForFarm(value)
            .then(function(data){
              getPlantTypesForFarm(value)
              .then(function(){

              }).catch(function(error){

              });
            }).catch(function(error){

            });
            i++;
          });
          defer.resolve(true);
        }).catch(function(error){
          defer.resolve(false);
        });
        defer.resolve(true);
      }
      else{
        defer.resolve(true);
      }
      return defer.promise;
    };


  };

}());
