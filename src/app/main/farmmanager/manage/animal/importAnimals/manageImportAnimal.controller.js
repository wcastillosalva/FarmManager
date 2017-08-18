(function () {
    'use strict';
    var app = angular.module('app.farmmanager');
    app.controller("manageImportAnimalsCtrl", manageImportAnimalsCtrl);

    /** @ngInject */
    function manageImportAnimalsCtrl($scope, $rootScope, manageFactory, adminFactory, $state, $stateParams, filterFilter, orderByFilter, $mdDialog, $mdToast, Papa, $q) {
        var model = this;
        model.animals = [];
        model.displayAnimals = [];
        model.animalSubTypes = [];

        model.farm = null;
        model.animalType = null;
        model.fatherCode = null;
        model.motherCode = null;
        model.showGrid = false;
        model.showResults =false;

        model.fileHasHeaders = false;
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
                }
            );

        }

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

        model.ngFlowOptions = {
            singleFile: true
        };

        model.ngFlow = {
            flow: {}
        };
        model.upload = function () {
            model.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
            };
            model.ngFlow.flow.upload();
        };

        model.imageSuccess = function (file, message) {
            Papa.parse(file.file, {
                config: {
                    header: model.fileHasHeaders,
                    skipEmptyLines: true
                },
                complete: function (results) {
                    _generateObjectsFromArray(results.data);
                }
            });
        };

        function _generateObjectsFromArray(rows) {
            //var defer = $q.defer();
            model.ngFlow.flow.cancel();
            var animalsToImport=[];
            if (model.fileHasHeaders){
              rows.shift();
            }
            angular.forEach(rows,function(value,key){
              if(value.length==7){
                var newImportAnimal= manageFactory.getNewAnimalObj();
                newImportAnimal.type=model.animalType.id;
                newImportAnimal.code=value[0];
                newImportAnimal.dateOfBirth=new Date(value[1]);
                newImportAnimal.fatherCode=value[2];
                newImportAnimal.motherCode=value[3];
                newImportAnimal.owner=value[4];
                newImportAnimal.sex=value[5];
                newImportAnimal.weight=value[6];
                animalsToImport.push(newImportAnimal);
              }
            });
            model.animals=animalsToImport;
            model.showGrid = true;
            //defer.resolve(true);
            //return defer.promise;
        };

        model.cancel=function(){
          model.animals=[];
          model.showGrid = false;
          model.showResults=false;
        };

        model.removeAnimal=function(animal){
          var index=model.animals.indexOf(animal);
          model.animals.splice(index,1);
        };

        model.getSubTypeName=function(animalSubTypeId){
          angular.forEach(model.animalSubTypes,function(value,key){
            if (key==animalSubTypeId)
              return value.type;
          });
        };

        function showAlert() {
          var confirm = $mdDialog.confirm()
              .title('Please confirm you want to import this data?')
              .textContent('After you click yes each row will be added like a new animal.')
              .ariaLabel('')
              .targetEvent(event)
              .ok('Yes')
              .cancel('No');
              $mdDialog.show(confirm)
              .then(function() {
                 sendData();
              }, function() {

              });
            };

        function sendData(){
          $rootScope.$emit('startLoadingProgress',[]);
          model.showGrid=false;
          model.showResults=true;
          co(function* () {
            yield manageFactory.importAnimals2(model.animals,model.farm);
            $rootScope.$emit('endLoadingProgress',[]);
          })();
        };

        model.sendImportedData=function(){
          showAlert();
        };

        model.close=function(){
          $state.go('app.farmmanager.manageListAnimals', {
            farmId: model.farm.id,
            animalTypeId: model.animalType.id,
            farm: model.farm,
            animalType: model.animalType
          });
        };
    }
}());
