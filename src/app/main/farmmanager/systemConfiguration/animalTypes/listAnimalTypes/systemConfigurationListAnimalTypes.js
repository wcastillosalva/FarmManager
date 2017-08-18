(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('systemConfigurationListAnimalTypesCtrl', systemConfigurationListAnimalTypesCtrl);

    /** @ngInject */
    function systemConfigurationListAnimalTypesCtrl($scope, adminFactory, manageFactory, connectionFactory, localStorageFactory, $state, $mdDialog, $mdToast) {
        var model = this;
        model.addPanelVisible = false;
        model.mainPanelVisible = true;
        model.animalTypes = [];
        model.showGrid = false;
        getAnimalTypes();

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

        function getAnimalTypes() {
            adminFactory.getAnimalTypes().then(
                function (data) {
                    getTotal(data);
                    model.animalTypes = data;
                }
            );
        };

        function getTotal(animalTypesObj) {
            angular.forEach(animalTypesObj, function (value, key) {
                manageFactory.getAnimalsByAnimalTypeCount(value).then(
                    function (data) {
                        value.total = data;
                    });
                adminFactory.getAnimalSubTypesCount(value).then(
                    function (data) {
                        value.totalSubTypes = data;
                    });
            });
        }

        model.add = function () {
            if (!connectionFactory.checkOffline(false))
                return;
            $state.go('app.farmmanager.systemConfigurationAddAnimalType');
        };

        model.goToManageAnimalSubType = function (animalType) {
            $state.go('app.farmmanager.systemConfigurationListAnimalSubTypes', {
                animalType: animalType,
                animalTypeId: animalType.id
            });
        };

        model.deleteAnimalType = function (animalType) {
            if (!connectionFactory.checkOffline(false))
                return;
            adminFactory.deleteAnimalType(animalType).then(
                function (data) {
                    if (data == true) {
                        adminFactory.getAnimalTypes().then(
                            function (data) {
                                model.animalTypes = data;
                            }
                        );
                        ngNotify.set('Animal type deleted successfully!', 'success');
                    }
                }
            ).catch(function (data) {
                ngNotify.set(data.message, 'error');
            });

        };

        model.addSubType = function (animalType) {
            if (!connectionFactory.checkOffline(false))
                return;
            $state.go('farmmanager.adminListAnimalSubTypes', {
                animalType: animalType,
                animalTypeId: animalType.id
            });
        };

        model.goToManageAnimalType = function (animalType) {
            $state.go('app.farmmanager.systemConfigurationAnimalType', {
                animalType: animalType,
                animalTypeId: animalType.id
            });
        };

        model.removeAnimalType = function (ev, animalType) {
            if (!connectionFactory.checkOffline(false))
                return;
            if (animalType.total != 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('There are animals asociated to this animal type, please change the animals with this animal types before removing this animal type!')
                );
            } else if (animalType.totalSubTypes != 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('There are animal sub types asociated to this animal type, please remove the animal sub types from this animal type before removing this animal type!')
                );
            } else {
                $mdDialog.show({
                        controller: 'removeAnimalTypeDialogCtrl',
                        templateUrl: 'app/main/farmmanager/dialogs/removeAnimalType/removeAnimalType.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true,
                        controllerAs: 'model',
                        locals: {
                            animalType: animalType
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            getAnimalTypes();
                        }
                    }, function () {

                    });
            }
        };
    }
})();
