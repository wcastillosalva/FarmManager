(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('systemConfigurationListPlantTypesCtrl', systemConfigurationListPlantTypesCtrl);

    /** @ngInject */
    function systemConfigurationListPlantTypesCtrl($scope, adminFactory, manageFactory, connectionFactory, localStorageFactory, $state, $mdToast, $mdDialog) {
        var model = this;
        model.addPanelVisible = false;
        model.mainPanelVisible = true;
        model.plantTypes = [];
        model.showGrid = false;
        getPlantTypes();

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

        function getPlantTypes() {
            adminFactory.getPlantTypes().then(
                function (data) {
                    getTotal(data);
                    model.plantTypes = data;
                }
            );
        };


        function getTotal(plantTypesObj) {
            angular.forEach(plantTypesObj, function (value, key) {
                manageFactory.getPlantsByPlantTypeCount(value).then(
                    function (data) {
                        value.total = data;
                    });
            });
        }

        model.add = function () {
            if (!connectionFactory.checkOffline(false))
                return;
            $state.go('app.farmmanager.systemConfigurationAddPlantType');
        };

        model.removePlantType = function (ev, plantType) {
            if (!connectionFactory.checkOffline(false))
                return;
            if (plantType.total != 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('There are plants asociated to this plant type, please change the plants with this plant types before removing this plant type!')
                );
            } else {
                $mdDialog.show({
                        controller: 'removePlantTypeDialogCtrl',
                        templateUrl: 'app/main/farmmanager/dialogs/removePlantType/removePlantType.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true,
                        controllerAs: 'model',
                        locals: {
                            plantType: plantType
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            getPlantTypes();
                        }
                    }, function () {

                    });
            }
        };

        model.goToManagePlantType = function (plantType) {
            $state.go('app.farmmanager.systemConfigurationPlantType', {
                plantType: plantType,
                plantTypeId: plantType.id
            });
        };
    }
})();
