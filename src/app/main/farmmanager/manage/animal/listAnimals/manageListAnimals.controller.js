(function () {
    'use strict';
    var app = angular.module('app.farmmanager');
    app.controller("manageListAnimalsCtrl", manageListAnimalsCtrl);

    /** @ngInject */
    function manageListAnimalsCtrl($scope, $rootScope, manageFactory, adminFactory, $state, $stateParams, filterFilter, orderByFilter, $mdDialog, $mdToast, localStorageFactory) {
        var model = this;
        model.animals = [];
        model.displayAnimals = [];
        model.animalSubTypes = [];

        model.farm = null;
        model.animalType = null;
        model.fatherCode = null;
        model.motherCode = null;
        model.showGrid = false;


        model.showImmages = showImmages;

        $scope.$watch('scrollEnd', function (newValue) {
            if (newValue) {
                model.loadMore();
                $rootScope.scrollEnd = false;
            }
        });

        model.changeViewType = function () {
            model.showGrid = !model.showGrid;
            localStorageFactory.setViewType(!model.showGrid);
        }

        model.showGrid = localStorageFactory.getViewType()== 'grid';

        if ($stateParams.farm == null) {
            if ($stateParams.farmId == '') {
                $state.go('app.farmmanager.manageListFarms');
            } else {
                adminFactory.getFarm($stateParams.farmId).then(function (data) {
                    model.farm = data;
                    checkAnimalTypeParam();
                });
            }
        } else {
            model.farm = $stateParams.farm;
            checkAnimalTypeParam();
        }

        var _searchText = '';

        function _clearSearch() {
            model.currentPage = 1;
            _searchText = '';
            model.animals = [];
            getAnimals();
        }

        $rootScope.$on('searchedTextChangeEvent', function (event, args) {
            if ($rootScope.searchedText) {
                _searchText = $rootScope.searchedText;
                _search();
            } else {
                _clearSearch();
            }
        });

        function _search() {
            if (_searchText != '') {
                model.currentPage = 1;
                model.animals = filterFilter(model.animals, {
                    code: _searchText
                });
                model.loadMore(true);
            } else {
                _clearSearch();
            }
        }

        model.sortType = '';
        model.sortReverse = true;
        model.sort = function (coll) {
            model.sortType = coll;
            model.sortReverse = !model.sortReverse;
            model.animals = orderByFilter(model.animals, model.sortType, model.sortReverse);
        }

        function checkAnimalTypeParam() {
            if ($stateParams.animalType == null) {
                if ($stateParams.animalTypeId == '') {
                    $state.go('app.farmmanager.manageFarm', {
                        farm: model.farm
                    });
                } else {
                    adminFactory.getAnimalType($stateParams.animalTypeId).then(function (data) {
                        model.animalType = data;
                        getAnimalSubTypes();

                    });
                }
            } else {
                model.animalType = $stateParams.animalType;
                getAnimalSubTypes();
            }
        };

        function getAnimalSubTypes() {
            adminFactory.getAnimalSubTypes(model.animalType).then(
                function (data) {
                    model.animalSubTypes = data;
                    getAnimals();
                }
            );

        }

        function getAnimals() {
            manageFactory.getAnimalsInFarmByAnimalType(model.farm, model.animalType).then(
                function (data) {
                    model.animals = data;
                    model.loadMore(true);
                }
            );

        };

        function getAnimalSubType(animalSubTypeId) {
            angular.forEach(model.animalSubTypes, function (value, key) {
                if (value.id == animalSubTypeId) {
                    return value;
                }
            });
        }

        adminFactory.getFarms().then(
            function (data) {
                model.farms = data;
            }
        );

        model.goToFarm = function (farm) {
            $state.go('app.farmmanager.manageFarm', {
                farm: farm,
                id: farm.id
            });
        };

        model.showMovePanel = function (ev, animal) {
            $mdDialog.show({
                    controller: 'moveAnimalDialogCtrl',
                    templateUrl: 'app/main/farmmanager/dialogs/moveAnimal/moveAnimal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controllerAs: 'model',
                    locals: {
                        animal: animal,
                        farm: model.farm
                    }
                })
                .then(function (answer) {
                    if (answer)
                        _clearSearch();
                }, function () {

                });
        };

        model.removeAnimal = function (ev, animal) {
            $mdDialog.show({
                    controller: 'removeAnimalDialogCtrl',
                    templateUrl: 'app/main/farmmanager/dialogs/removeAnimal/removeAnimal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controllerAs: 'model',
                    locals: {
                        animal: animal
                    }
                })
                .then(function (answer) {
                    if (answer) {
                        _clearSearch();
                    }
                }, function () {

                });
        };

        model.sellAnimal = function (ev, animal) {
            $mdDialog.show({
                    controller: 'sellAnimalDialogCtrl',
                    templateUrl: 'app/main/farmmanager/dialogs/sellAnimal/sellAnimal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controllerAs: 'model',
                    locals: {
                        animal: animal
                    }
                })
                .then(function (answer) {
                    if (answer) {
                        _clearSearch();
                    }
                }, function () {

                });
        };

        model.addChild = function (animal) {
            $state.go('app.farmmanager.manageAddAnimal', {
                farmId: model.farm.id,
                animalTypeId: model.animalType.id,
                farm: model.farm,
                animalType: model.animalType,
                motherCode: animal.code
            });
        };

        model.manage = function (animal) {
            $state.go('app.farmmanager.manageAnimal', {
                farmId: model.farm.id,
                animalTypeId: model.animalType.id,
                animalId: animal.id,
                farm: model.farm,
                animalType: model.animalType,
                animal: animal
            });
        };
        model.importAnimals = function () {
            $state.go('app.farmmanager.manageImportAnimals', {
                farmId: model.farm.id,
                animalTypeId: model.animalType.id,
                farm: model.farm,
                animalType: model.animalType
            });
        }
        model.add = function () {
            $state.go('app.farmmanager.manageAddAnimal', {
                farmId: model.farm.id,
                animalTypeId: model.animalType.id,
                farm: model.farm,
                animalType: model.animalType
            });
        };

        model.pinnAnimal = function (animal) {
            manageFactory.pinAnimal(animal, true).then(
                function (data) {
                    if (data == '1') {
                        animal.pinned = true;
                        $mdToast.show(
                            $mdToast.simple().textContent('Animal pinned from home successfully')
                        );
                        getAnimals();
                    }
                }
            );
        };

        model.unpinnAnimal = function (animal) {
            manageFactory.pinAnimal(animal, false).then(
                function (data) {
                    if (data == '1') {
                        animal.pinned = false;
                        $mdToast.show(
                            $mdToast.simple().textContent('Animal unpinned from home successfully')
                        );
                        getAnimals();
                    }
                }
            );
        };

        model.loadMore = function (isFirstTime) {
            if (isFirstTime) {
                model.displayAnimals = model.animals.slice(0, 10);
            } else if (model.displayAnimals.length + 5 < model.animals.length) {
                model.displayAnimals = model.animals.slice(0, model.displayAnimals.length + 5);
            } else {
                model.displayAnimals = model.animals;
            }
        };
        //$scope.model = model;
    }
}());
