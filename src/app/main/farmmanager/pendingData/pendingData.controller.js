(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .controller('pendingDataCtrl', pendingDataCtrl);

    /** @ngInject */
    function pendingDataCtrl($scope, manageFactory, localDbFactory, $mdToast, $rootScope, $filter, $timeout, $q) {
        var model = this;
        model.showGrid = true;
        // Data
        model.pendingChanges = 0;
        model.pendingAnimals = 0;
        model.pendingNewAnimals = 0;
        model.pendingAnimalsPhotos = 0;
        model.pendingAnimalsEvents = 0;
        model.pendingDataResult=[];
        model.pendingDataEnabled = false;
        model.showDetails=false;

        $rootScope.$on('connectionChangeEvent', function (event, data) {
            if ($scope.refreshPendingDataMonitor) {
              refreshPendingData();
            }
        });
        refreshPendingData();
        function refreshPendingData(){
          refreshAllPendingData();
          getPendingNewAnimals();
          getPendingAnimals();
          getPendingAnimalsPhotos();
          getPendingAnimalsEvents();
        };

        function refreshAllPendingData(){
            localDbFactory.getAllPendingCountLocalDb()
            .then(function(data){
              model.pendingChanges=data;
            }).catch(function(error){
              $mdToast.show(
                  $mdToast.simple().textContent(error)
              );
            });
        };

        function getPendingNewAnimals() {
            localDbFactory.getAllNewAnimalsCountLocalDb()
                .then(function (data) {
                    model.pendingNewAnimals = data;
                    model.pendingDataEnabled = data > 0;
                }).catch(function (error) {
                    $mdToast.show(
                        $mdToast.simple().textContent(error)
                    );
                });
        };

        function getPendingAnimals() {
            localDbFactory.getAllAnimalsCountLocalDb()
                .then(function (data) {
                    model.pendingAnimals = data;
                    model.pendingDataEnabled = data > 0;
                }).catch(function (error) {
                    $mdToast.show(
                        $mdToast.simple().textContent(error)
                    );
                });
        };

        function getPendingAnimalsPhotos() {
            localDbFactory.getAllAnimalsPhotosCountLocalDb()
                .then(function (data) {
                    model.pendingAnimalsPhotos = data;
                    model.pendingDataEnabled = data > 0;
                }).catch(function (error) {
                    $mdToast.show(
                        $mdToast.simple().textContent(error)
                    );
                });
        };

        function getPendingAnimalsEvents() {
            localDbFactory.getAllAnimalsEventsCountLocalDb()
                .then(function (data) {
                    model.pendingAnimalsEvents = data;
                    model.pendingDataEnabled = data > 0;
                }).catch(function (error) {
                    $mdToast.show(
                        $mdToast.simple().textContent(error)
                    );
                });
        };

        model.getWidgetClass = function (value) {
            if (value == 0) {
                return 'blue-grey-fg';
            } else if (value > 0 & value <= 15) {
                return 'light-blue-fg';
            } else if (value > 15 & value <= 25) {
                return 'orange-fg';
            } else {
                return 'red-fg';
            }
        };
        model.getPendingTypeTitle =function(pendingType){
          return manageFactory.getPendingTypeTitle(pendingType);
        };

        model.sendPendingData2 = function () {
          model.showDetails=true;
          $rootScope.$emit('startLoadingProgress',[]);
          co(function* () {
            model.pendingDataResult = yield manageFactory.getAllPendingData2();
            yield manageFactory.sendAllPendingNewAnimalsData2(model.pendingDataResult.pendingNewAnimals);
            yield manageFactory.sendAllPendingAnimalsData2(model.pendingDataResult.pendingAnimals);
            yield manageFactory.sendAllPendingAnimalsEventsData2(model.pendingDataResult.pendingAnimalsEvents);
            yield manageFactory.sendAllPendingAnimalsPhotosData2(model.pendingDataResult.pendingAnimalsPhotos);
            $rootScope.$emit('endLoadingProgress',[]);
            refreshPendingData();
          })();
        };
    }
})();
