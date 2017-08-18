(function () {
    'use strict';
    var app = angular.module('app.farmmanager');
    app.controller("manageAnimalCtrl", manageAnimalCtrl);

    /** @ngInject */
    function manageAnimalCtrl($scope, manageFactory, adminFactory, $state, $stateParams, $q, $mdToast, $mdDialog, $rootScope, $mdMedia) {
        var model = this;
        model.animal = {};
        model.animalType = {};
        model.animalTypes = [];
        model.animalSubTypes = [];
        model.animalSubTypeId = null;
        model.showTimeline = false;
        model.events = {};
        model.viewOnly = true;
        model.screenIsSmall = $mdMedia('xs');

        model.image = {
            content: null,
            imageExtension: null
        };
        model.displayImage = false;
        model.imageWasChanged = false;

        model.ngFlowOptions = {
            singleFile: true
        };
        model.ngFlow = {
            flow: {}
        };

        getFarmParam().then(function (data) {
            model.farm = data;
        });

        function getFarmParam() {
            var defer = $q.defer();
            if ($stateParams.farm == null) {
                if ($stateParams.farmId == '')
                    $state.go('app.farmmanager.manageListFarms');
                else {
                    adminFactory.getFarm($stateParams.farmId).then(
                        function (data) {
                            defer.resolve(data);
                        }
                    ).catch(function (error) {
                        defer.reject(false);
                    });
                }

            } else {
                defer.resolve($stateParams.farm);
            }
            return defer.promise;
        };

        getAnimalTypeParam().then(function (data) {
            model.animalTypeId = data.id;
            model.animalType = data;
            model.animalTypes.push(data);
        });

        function getAnimalTypeParam() {
            var defer = $q.defer();
            if ($stateParams.animalType == null) {
                if ($stateParams.animalTypeId == '')
                    $state.go('app.farmmanager.manageFarm', {
                        id: $stateParams.farmId,
                        farm: model.farm
                    });
                else {
                    adminFactory.getAnimalType($stateParams.animalTypeId).then(
                        function (data) {
                            defer.resolve(data);
                        }
                    ).catch(function (error) {
                        defer.reject(error);
                    });
                }
            } else {
                defer.resolve($stateParams.animalType);
            }
            return defer.promise;
        };

        getAnimalParam().then(function (data) {
            model.animal = data;
            //angular.copy(model.animal.events, model.events);
            //getEventTypes();
            if (model.animal.dateOfBirth == '') {
                model.animal.dateOfBirth = null;
            } else {
                model.animal.dateOfBirth = new Date(model.animal.dateOfBirth);
            }
            angular.copy(model.animal.events, model.events);
            angular.forEach(model.events, function (value, key) {
                value.title = manageFactory.setEventTitle(value);
            })
            //value.title=manageFactory.setEventTitle(value);
        });

        function getAnimalParam() {
            var defer = $q.defer();
            if ($stateParams.animal == null) {
                if ($stateParams.animalId == '') {
                    $state.go('app.farmmanager.manageFarm', {
                        farm: model.farm,
                        farmId: $stateParams.farmId
                    });
                } else {
                    manageFactory.getAnimal($stateParams.animalId).then(function (data) {
                        defer.resolve(data);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
                }
            } else {
                defer.resolve($stateParams.animal);
            }
            return defer.promise;
        };

        $q.all([getFarmParam(), getAnimalTypeParam(), getAnimalParam()]).then(function (data) {
            getAnimalSubTypes();
        });

        function getAnimalSubTypes() {
            adminFactory.getAnimalSubTypes(model.animalType).then(
                function (data) {
                    model.animalSubTypes = data;
                    if (model.animal != null) {
                        angular.forEach(model.animalSubTypes, function (value, key) {
                            if (value.id == model.animal.subType)
                                model.animalSubType = value;
                        });
                    }
                }
            );
        };

        model.showAllFields = function () {
            model.screenIsSmall = false;
        };

        model.getEventLogo = function (event) {
            return manageFactory.getEventLogo(event);
        };

        model.getEventColor = function (event) {
            return manageFactory.getEventColor(event);
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
            }).then(function (answer) {
                if (answer)
                    model.cancel();
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
            }).then(function (answer) {
                if (answer) {
                    model.cancel();
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
            }).then(function (answer) {
                if (answer) {
                    model.cancel();
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

        model.edit = function (animal) {
            model.viewOnly = false;
        };

        model.addEvent = function (ev, animal) {
            $mdDialog.show({
                controller: 'addEventAnimalDialogCtrl',
                templateUrl: 'app/main/farmmanager/dialogs/addEventAnimal/addEventAnimal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                controllerAs: 'model',
                locals: {
                    animal: animal,
                    farm: model.farm
                }
            }).then(function (answer) {
                if (answer) {
                    model.cancel();
                }
            }, function () {

            });
        };

        model.cancel = function () {
            if (model.viewOnly) {
                $state.go('app.farmmanager.manageListAnimals', {
                    farmId: model.farm.id,
                    animalTypeId: model.animalType.id,
                    farm: model.farm,
                    animalType: model.animalType
                });
            } else {
                model.imageWasChanged = false;
                model.viewOnly = true;
            }
        };

        model.upload = function () {
            model.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
            };
            model.ngFlow.flow.upload();
        };

        model.imageSuccess = function (file, message) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file.file);
            fileReader.onload = function (event) {
                file.url = event.target.result;
                $scope.$evalAsync(function () {
                    model.image.content = file.url;
                    model.image.imageExtension = file.name.split('.').pop();;
                    model.displayImage = true;
                });
            };
            file.type = 'image';
        };

        model.changeImmage = function () {
            model.image.content = null;
            model.image.imageExtension = null;
            model.displayImage = false;
            model.imageWasChanged = true;
            model.ngFlow.flow.cancel();
        };

        model.save = function () {
            $rootScope.$emit('startLoadingProgress', []);
            model.animal.type = model.animalType.id;
            model.animal.subType = model.animalSubType.id;
            manageFactory.saveAnimal(model.animal, model.farm, model.image)
                .then(function (data) {
                    if (data == '1') {
                        $mdToast.show(
                            $mdToast.simple().textContent('Animal added successfully')
                        );
                        $rootScope.$emit('endLoadingProgress', []);
                        $state.go('app.farmmanager.manageListAnimals', {
                            farmId: model.farm.id,
                            animalTypeId: model.animalType.id,
                            farm: model.farm,
                            animalType: model.animalType
                        });
                    }
                }).catch(function (data) {
                    $mdToast.show(
                        $mdToast.simple().textContent(data.message)
                    );
                    $rootScope.$emit('endLoadingProgress', []);
                });
        };
    }
}());
