(function () {
    'use strict';
    var app = angular.module('app.farmmanager');
    app.controller("manageAddAnimalCtrl", manageAnimalCtrl);

    /** @ngInject */
    function manageAnimalCtrl($scope, manageFactory, adminFactory, $state, $stateParams, $q, $mdToast, $rootScope, $mdMedia) {
        var model = this;
        model.animal = {};
        model.animalType = {};
        model.animalTypes = [];
        model.animalSubTypes = [];
        model.animalSubTypeId = null;

        model.screenIsSmall = $mdMedia('xs');
        model.animal = manageFactory.getNewAnimalObj();

        model.image = {
            content: null,
            imageExtension: null
        };

        model.displayImage = false;

        getFarmParam().then(function (data) {
            model.farm = data;
        });

        function getFarmParam() {
            var defer = $q.defer();
            if ($stateParams.farm == null) {
                if ($stateParams.farmId == '') {
                    $state.go('app.farmmanager.manageListFarms');
                } else {
                    adminFactory.getFarm($stateParams.farmId)
                        .then(function (data) {
                            defer.resolve(data);
                        }).catch(function (error) {
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
                if ($stateParams.animalTypeId == '') {
                    $state.go('app.farmmanager.manageFarm', {
                        id: $stateParams.farmId,
                        farm: model.farm
                    });
                } else {
                    adminFactory.getAnimalType($stateParams.animalTypeId)
                        .then(function (data) {
                            defer.resolve(data);
                        }).catch(function (error) {
                            defer.reject(error);
                        });
                }
            } else {
                defer.resolve($stateParams.animalType);
            }
            return defer.promise;
        };

        $q.all([getFarmParam(), getAnimalTypeParam()]).then(function (data) {
            getAnimalSubTypes();
        });

        function getAnimalSubTypes() {
            adminFactory.getAnimalSubTypes(model.animalType)
                .then(function (data) {
                    model.animalSubTypes = data;
                    if (model.animal != null) {
                        angular.forEach(model.animalSubTypes, function (value, key) {
                            if (value.id == model.animal.subType)
                                model.animalSubType = value;
                        });
                    }
                });
        };

        model.showAllFields = function () {
            model.screenIsSmall = false;
        };

        model.cancel = function () {
            $state.go('app.farmmanager.manageListAnimals', {
                farmId: model.farm.id,
                animalTypeId: model.animalType.id,
                farm: model.farm,
                animalType: model.animalType
            });
        };

        model.ngFlowOptions = {
            singleFile: true
        };

        model.ngFlow = {
            flow: {}
        };

        model.upload = function () {
            // Set headers
            model.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
                //'X-XSRF-TOKEN'    : $cookies.get('XSRF-TOKEN')
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
            model.ngFlow.flow.cancel();
        };

        function hasExtension(fileName, exts) {
            return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
        };

        model.addAnimal = function () {
            $rootScope.$emit('startLoadingProgress', []);
            model.animal.type = model.animalType.id;
            if (model.animalSubTypeId) {
                model.animal.subType = model.animalSubTypeId;
            }
            if (!model.animal.dateOfBirth) {
                model.animal.dateOfBirth = "";
            }
            manageFactory.addAnimal(model.animal, model.farm, model.image).then(function (data) {
                if (data == '1') {
                    $mdToast.show(
                        $mdToast.simple().textContent('Animal added successfully')
                    );
                    $rootScope.$emit('endLoadingProgress', []);
                    model.cancel();
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
