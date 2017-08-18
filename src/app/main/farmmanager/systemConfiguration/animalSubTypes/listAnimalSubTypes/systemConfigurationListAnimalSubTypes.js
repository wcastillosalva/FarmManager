(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('systemConfigurationListAnimalSubTypesCtrl', systemConfigurationListAnimalSubTypesCtrl);

    /** @ngInject */
    function systemConfigurationListAnimalSubTypesCtrl($scope, adminFactory, manageFactory, localStorageFactory, connectionFactory, $state, $mdDialog, $q, $stateParams, $mdToast) {
        var model = this;
        model.addPanelVisible = false;
        model.mainPanelVisible = true;
        model.animalSubTypes = [];
        model.showGrid = false;

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

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

        function getAnimalSubTypes() {
            adminFactory.getAnimalSubTypes(model.animalType).then(
                function (data) {
                    getTotal(data);
                    model.animalSubTypes = data;
                }
            );
        };


        function getTotal(animalSubTypesObj) {
            angular.forEach(animalSubTypesObj, function (value, key) {
                manageFactory.getAnimalsByAnimalSubTypeCount(value).then(
                    function (data) {
                        value.total = data;
                    });
            });
        }

        model.add = function () {
            if (!connectionFactory.checkOffline(false))
                return;
            $state.go('app.farmmanager.systemConfigurationAddAnimalSubType', {
                animalType: model.animalType,
                animalTypeId: model.animalType.id
            });
        };

        model.cancel = function () {
            $state.go('app.farmmanager.systemConfigurationListAnimalTypes');
        };

        model.deleteAnimalSubType = function (animalType) {
            if (!connectionFactory.checkOffline(false))
                return;
            adminFactory.deleteAnimalSubType(animalType).then(
                function (data) {
                    if (data == true) {
                        adminFactory.getAnimalSubTypes(model.animalType).then(
                            function (data) {
                                model.animalSubTypes = data;
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

        model.goToManageAnimalSubType = function (animalSubType) {
            $state.go('app.farmmanager.systemConfigurationAnimalSubType', {
                animalType: model.animalType,
                animalTypeId: model.animalType.id,
                animalSubType: animalSubType,
                animalSubTypeId: animalSubType.id
            });
        };

        model.removeAnimalSubType = function (ev, animalSubType) {
            if (!connectionFactory.checkOffline(false))
                return;
            if (animalSubType.total != 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('There are animals asociated to this animal sub type, please change the animals with this animal sub type before removing this animal sub type!')
                );
            } else {
                $mdDialog.show({
                        controller: 'removeAnimalSubTypeDialogCtrl',
                        templateUrl: 'app/main/farmmanager/dialogs/removeAnimalSubType/removeAnimalSubType.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true,
                        controllerAs: 'model',
                        locals: {
                            animalSubType: animalSubType
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            getAnimalSubTypes();
                        }
                    }, function () {

                    });
            }
        };
    }
})();
