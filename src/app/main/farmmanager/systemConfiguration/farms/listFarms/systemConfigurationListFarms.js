(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('systemConfigurationListFarmsCtrl', systemConfigurationListFarmsCtrl);

    /** @ngInject */
    function systemConfigurationListFarmsCtrl($scope, adminFactory, manageFactory, connectionFactory, localStorageFactory, $state, weatherFactory, $mdDialog, $mdToast) {
        var model = this;
        model.addPanelVisible = false;
        model.mainPanelVisible = true;
        model.farms = [];
        model.showGrid = false;
        getFarms();

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

        function getFarms() {
            adminFactory.getFarms().then(
                function (data) {
                    getTotal(data);
                    getWeatherInfo(data);
                    model.farms = data;
                }
            );
        };


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

        }

        function getWeatherInfo(farmsObj) {
            angular.forEach(farmsObj, function (value, key) {
                weatherFactory.getWeather(value.map.split(',')[0], value.map.split(',')[1]).then(
                    function (data) {
                        value.weatherInfo = data;
                    });
            });
        }

        model.add = function () {
            if (!connectionFactory.checkOffline(false))
                return;
            $state.go('app.farmmanager.systemConfigurationAddFarm');
        };

        model.view = function (farm) {
            $state.go('app.farmmanager.systemConfigurationFarm', {
                farm: farm,
                farmId: farm.id
            });
        };

        model.removeFarm = function (ev, farm) {
            if (!connectionFactory.checkOffline(false))
                return;
            if (farm.totalAnimals != 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('There are animals in that farm, please move the animals before removing this farm!')
                );
            } else if (farm.totalPlants != 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('There are plants in that farm, please move the plants before removing this farm!')
                );
            } else {
                $mdDialog.show({
                        controller: 'removeFarmDialogCtrl',
                        templateUrl: 'app/main/farmmanager/dialogs/removeFarm/removeFarm.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true,
                        controllerAs: 'model',
                        locals: {
                            farm: farm
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            getFarms();
                        }
                    }, function () {

                    });
            }

        };

        model.manageAnimalTypesInFarm = function (ev, farm) {
            if (!connectionFactory.checkOffline(false))
                return;
            $mdDialog.show({
                    controller: 'manageAnimalTypesInFarmDialogCtrl',
                    templateUrl: 'app/main/farmmanager/dialogs/manageAnimalTypesInFarm/manageAnimalTypesInFarm.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controllerAs: 'model',
                    locals: {
                        farm: farm
                    }
                })
                .then(function (answer) {
                    if (answer) {
                        getFarms();
                    }
                }, function () {

                });

        };

        model.managePlantTypesInFarm = function (ev, farm) {
            if (!connectionFactory.checkOffline(false))
                return;
            $mdDialog.show({
                    controller: 'managePlantTypesInFarmDialogCtrl',
                    templateUrl: 'app/main/farmmanager/dialogs/managePlantTypesInFarm/managePlantTypesInFarm.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controllerAs: 'model',
                    locals: {
                        farm: farm
                    }
                })
                .then(function (answer) {
                    if (answer) {
                        getFarms();
                    }
                }, function () {

                });

        };

    }
})();
