(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('manageFarmCtrl', manageFarmCtrl);

    /** @ngInject */
    function manageFarmCtrl($scope, adminFactory, manageFactory, localStorageFactory, $state, $stateParams) {
        var model = this;
        model.plantTypes = [];
        model.animalTypes = [];
        model.showGrid = false;
        model.animalTypesChart = [];

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

        model.farm = null;
        if ($stateParams.farm == null) {
            {
                if ($stateParams.id == '')
                    $state.go('app.farmmanager.manageListFarms');
                else
                    adminFactory.getFarm($stateParams.id).then(
                        function (data) {
                            model.farm = data;
                            getInitialData();
                        }
                    );
            }
        } else {
            model.farm = $stateParams.farm;
            getInitialData();
        }

        model.chart = {
            data: {
                labels: ["Cows", "Bulls", "Calfs"],
                data: [500, 200, 800]
            }
        };

        function getInitialData() {
            adminFactory.getAnimalTypesForFarm(model.farm).then(
                function (data) {
                    model.animalTypes = data;
                    getChartData();
                    angular.forEach(data, function (value, key) {
                        manageFactory.getAnimalsInFarmByAnimalTypeCount(model.farm, value).then(function (data) {
                            value.total = data;
                        }).catch(function (error) {
                            value.total = 0;
                        });
                    });
                }
            );

            adminFactory.getPlantTypesForFarm(model.farm).then(
                function (data) {
                    model.plantTypes = data;
                }
            );
        }

        function getChartData() {
            angular.forEach(model.animalTypes, function (value, key) {
                var animalTypeChart = {
                    type: value.type,
                    data: {
                        labels: [],
                        data: []
                    }
                };
                adminFactory.getAnimalSubTypes(value).then(function (data) {
                    angular.forEach(data, function (valueSubType, keySubType) {
                        animalTypeChart.data.labels.push(valueSubType.type);
                        manageFactory.getAnimalsInFarmByAnimalSubTypeCount(model.farm, valueSubType).then(function (total) {
                            animalTypeChart.data.data.push(total);
                        });

                    });
                });
                model.animalTypesChart.push(animalTypeChart);
            });
        };
        model.manageAnimal = function (animalType) {
            if (animalType.managementAsGroup) {

            } else {
                $state.go('app.farmmanager.manageListAnimals', {
                    farm: model.farm,
                    farmId: model.farm.id,
                    animalType: animalType,
                    animalTypeId: animalType.id
                });
            }

        }

        Chart.defaults.global.legend.display = true;
        $scope.model = model;
    }
}());
