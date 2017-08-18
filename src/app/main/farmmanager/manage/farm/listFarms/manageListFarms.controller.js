(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('manageListFarmsCtrl', manageListFarmsCtrl);

    /** @ngInject */
    function manageListFarmsCtrl($scope, adminFactory, manageFactory, localStorageFactory, $state, weatherFactory) {
        var model = this;
        model.addPanelVisible = false;
        model.mainPanelVisible = true;
        model.farms = [];
        model.showGrid = false;

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

        //function printFarms(value){
          co(function* () {
            var data =yield adminFactory.getFarms2();
            getTotal(data);
            getWeatherInfo(data);
            model.farms = data;
          })();
        //}

        /*
        adminFactory.getFarms().then(
            function (data) {
                getTotal(data);
                getWeatherInfo(data);
                model.farms = data;
            }
        );*/

        function getTotal(farmsObj) {
            angular.forEach(farmsObj, function (value, key) {
                manageFactory.getAnimalsInFarmCount(value).then(
                    function (data) {
                        value.totalAnimals = data;
                    });
                manageFactory.getPlantsInFarmCount(value).then(
                    function (data) {
                        value.totalPlants = data;
                    });
            });
        };

        function getWeatherInfo(farmsObj) {
            angular.forEach(farmsObj, function (value, key) {
                weatherFactory.getWeather(value.map.split(',')[0], value.map.split(',')[1]).then(
                    function (data) {
                        value.weatherInfo = data;
                    });
            });
        }

        model.goToManageFarm = function (farm) {
            $state.go('app.farmmanager.manageFarm', {
                farm: farm,
                id: farm.id
            });
        };
    }
})();
