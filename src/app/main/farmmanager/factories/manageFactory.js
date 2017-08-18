(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .factory('manageFactory', manageFactory);
    /** @ngInject */
    function manageFactory($q, $filter, $rootScope, $linq, localDbFactory) {
        var _dateFormat = "yyyy-MM-ddTHH:mm:ss";
        return {
            getPinnedAnimals: _getPinnedAnimals,
            getAnimalsInFarmByAnimalType: _getAnimalsInFarmByAnimalType,
            getAnimalsInFarmByAnimalTypeCount: _getAnimalsInFarmByAnimalTypeCount,
            getAnimalsInFarmByAnimalSubTypeCount: _getAnimalsInFarmByAnimalSubTypeCount,
            getAnimalsInFarmCount: _getAnimalsInFarmCount,
            getAnimalsByAnimalTypeCount: _getAnimalsByAnimalTypeCount,
            getAnimalsByAnimalSubTypeCount: _getAnimalsByAnimalSubTypeCount,

            getPlantsInFarmByPlantType: _getPlantsInFarmByPlantType,
            getPlantsInFarmByPlantTypeCount: _getPlantsInFarmByPlantTypeCount,
            getPlantsInFarmCount: _getPlantsInFarmCount,
            getPlantsByPlantTypeCount: _getPlantsByPlantTypeCount,

            getNewAnimalObj: _getNewAnimalObj,
            getAnimal: _getAnimal,
            getAnimalFromCode: _getAnimalFromCode,
            saveAnimal: _saveAnimal,
            importAnimals2: _importAnimals2,
            addAnimal: _addAnimal,
            addEventToAnimal: _addEventToAnimal,
            moveAnimal: _moveAnimal,
            removeAnimal: _removeAnimal,
            sellAnimal: _sellAnimal,
            getAnimalChilds: _getAnimalChilds,
            pinAnimal: _pinAnimal,

            getEventLogo: _getEventLogo,
            getEventColor: _getEventColor,
            setEventTitle: _setEventTitle,
            getRemovedReasonAnimalCatalog: _getRemovedReasonAnimalCatalog,

            getAllPendingData2:_getAllPendingData2,
            sendAllPendingNewAnimalsData2:_sendAllPendingNewAnimalsData2,
            sendAllPendingAnimalsData2:_sendAllPendingAnimalsData2,
            sendAllPendingAnimalsEventsData2:_sendAllPendingAnimalsEventsData2,
            sendAllPendingAnimalsPhotosData2:_sendAllPendingAnimalsPhotosData2,

            sendAllPendingData: _sendAllPendingData,
            sendDataPendingNewAnimals: _sendDataPendingNewAnimals,
            sendDataPendingAnimals: _sendDataPendingAnimals,
            sendDataPendingAnimalsPhotos: _sendDataPendingAnimalsPhotos,
            sendDataPendingAnimalsEvents: _sendDataPendingAnimalsEvents,

            getPendingTypeTitle:_getPendingTypeTitle
        };

        var pendingDataObj=[];


        function *_getAllPendingData2() {
          var response={
            pendingNewAnimals:[],
            pendingAnimals:[],
            pendingAnimalsEvents:[],
            pendingAnimalsPhotos:[]
          };

          try {
            var pendingNewAnimals= yield localDbFactory.getAllNewAnimalsLocalDb();
            angular.forEach(pendingNewAnimals, function(value,key){
              response.pendingNewAnimals.push({
                type:'NewAnimal',
                animalCode:value.code,
                status:'NotSynced',
                data:value
              });
            });
          } catch (e) {}
          try {
            var pendingAnimals= yield localDbFactory.getAllAnimalsLocalDb();
            angular.forEach(pendingAnimals, function(value,key){
              response.pendingAnimals.push({
                type:'Animal',
                animalCode:value.code,
                status:'NotSynced',
                data:value
              });
            });
          } catch (e) {}
          try {
             var pendingAnimalsEvents = yield localDbFactory.getAllAnimalsEventsLocalDb();
             angular.forEach(pendingAnimalsEvents, function(value,key){
               response.pendingAnimalsEvents.push({
                 type:'AnimalEvent',
                 animalCode:value.animalCode,
                 status:'NotSynced',
                 data:value
               });
             });
           } catch (e) {}
          try {
            var pendingAnimalsPhotos = yield localDbFactory.getAllAnimalsPhotosLocalDb();
            angular.forEach(pendingAnimalsPhotos, function(value,key){
              response.pendingAnimalsPhotos.push({
                type:'AnimalPhoto',
                animalCode:value.animalCode,
                status:'NotSynced',
                data:value
              });
            });
          } catch (e) {}

          return response;
        };

        function *_sendAllPendingNewAnimalsData2(pendingNewAnimals) {
          for (var i = 0; i < pendingNewAnimals.length; i++) {
            var pendingObj= pendingNewAnimals[i];
            try {
              pendingObj.sent = yield _sendNewAnimalOnlineFromLocalDb(pendingObj.data);
            } catch (error) {
              pendingObj.sent = false;
              pendingObj.error = error;
            }
          }
        };

        function *_sendAllPendingAnimalsData2(pendingAnimals) {
          for (var i = 0; i < pendingAnimals.length; i++) {
            var pendingObj= pendingAnimals[i];
            try {
              pendingObj.sent = yield _sendAnimalOnlineFromLocalDb(pendingObj.data);
            } catch (error) {
              pendingObj.sent = false;
              pendingObj.error = error;
            }
          }
        };

        function *_sendAllPendingAnimalsEventsData2(pendingAnimalsEvents) {
          for (var i = 0; i < pendingAnimalsEvents.length; i++) {
            var pendingObj= pendingAnimalsEvents[i];
            try {
              pendingObj.sent = yield _sendAnimalEventOnlineFromLocalDb(pendingObj.data);
            } catch (error) {
              pendingObj.sent = false;
              pendingObj.error = error;
            }
          }
        };

        function *_sendAllPendingAnimalsPhotosData2(pendingAnimalsPhotos) {
          for (var i = 0; i < pendingAnimalsPhotos.length; i++) {
            var pendingObj= pendingAnimalsPhotos[i];
            try {
              pendingObj.sent = yield _sendAnimalPhotoOnlineFromLocalDb(pendingObj.data);
            } catch (error) {
              pendingObj.sent = false;
              pendingObj.error = error;
            }
          }
        };

        function *_importAnimals2(animals, farm){
            for (var i = 0; i < animals.length; i++) {
              try {
                var result= yield  _addAnimal(animals[i],farm);
                if (result == '1') {
                    animals[i].sent=true;
                }
              } catch (error) {
                animals[i].sent=false;
                animals[i].error=error;
              }
            }
        }

        function _sendAllPendingData() {
          var pendingPromises=[];
            var defer = $q.defer();
            if(!pendingDataObj)
            {
              pendingDataObj=[];
            }
                _sendDataPendingNewAnimals()
                    .then(function (data) {
                      pendingDataObj=pendingDataObj.concat(data.results);
                      pendingPromises=pendingPromises.concat(data.promises);
                        return _sendDataPendingAnimals();
                    }).then(function (data) {
                      pendingDataObj=pendingDataObj.concat(data.results);
                      pendingPromises=pendingPromises.concat(data.promises);
                        return _sendDataPendingAnimalsEvents();
                    }).then(function (data) {
                      pendingDataObj=pendingDataObj.concat(data.results);
                      pendingPromises=pendingPromises.concat(data.promises);
                        return _sendDataPendingAnimalsPhotos();
                    })
                    .then(function (data) {
                        pendingDataObj=pendingDataObj.concat(data.results);
                        pendingPromises=pendingPromises.concat(data.promises);
                        defer.resolve({results:pendingDataObj,promises:pendingPromises});
                    })
                    .catch(function (error) {
                        defer.reject(error);
                    });
            return defer.promise;
        };

        function _sendAnimalEventOnlineFromLocalDb(eventObjBase) {
            var defer = $q.defer();
            var eventObj = {
                key: eventObjBase.key,
                date: eventObjBase.date,
                message: eventObjBase.message,
                type: eventObjBase.type
            };
            _saveEventInAnimalObjOnline(eventObjBase.animalId, eventObj)
                .then(function (data) {
                    localDbFactory.removeAnimalEventLocalDb(eventObjBase)
                        .then(function (data) {
                            defer.resolve(true);
                        }).catch(function (error) {
                            defer.reject(error);
                        });
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _sendAnimalPhotoOnlineFromLocalDb(photo) {
            var defer = $q.defer();
            var photoObj = {
                content: photo.content,
                photoName: photo.photoName,
                photoKey: photo.key
            };
            _saveAnimalEventPhotoOnline(photo.animalId, photoObj)
                .then(function (data) {
                    data.date = $filter('date')(new Date, _dateFormat);
                    _savePhotoInAnimalObjOnline(photo.animalId, data)
                        .then(function (data) {
                            localDbFactory.removeAnimalPhotoLocalDb(photo)
                                .then(function (data) {
                                    defer.resolve(true);
                                }).catch(function (error) {
                                    defer.reject(error);
                                });
                        }).catch(function (error) {
                            defer.reject(error);
                        });
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _sendDataPendingAnimalsEvents() {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
                var pendingAnimalsEvents=[];
                var sendAnimalEventsOnlinePromises = [];
                localDbFactory.getAllAnimalsEventsLocalDb()
                    .then(function (localAnimalEvents) {
                        angular.forEach(localAnimalEvents, function (value, key) {
                          var animalEventStatus={
                            type:'AnimalEvent',
                            animalCode:value.animalCode,
                            status:'NotSynced'
                          };
                          pendingAnimalsEvents.push(animalEventStatus);
                          var animalEventPromise=_sendAnimalEventOnlineFromLocalDb(value)
                          .then(function (data) {
                              animalEventStatus.sent=true;
                          }).catch(function (error) {
                                animalEventStatus.sent=false;
                                animalEventStatus.error=error;
                          });
                          sendAnimalEventsOnlinePromises.push(animalEventPromise);
                        });
                        if (sendAnimalEventsOnlinePromises.length > 0) {
                            $q.all(sendAnimalEventsOnlinePromises)
                            .then(function (data) {
                                _getAnimalsAlive(true);
                            });
                        }
                        defer.resolve(pendingAnimalsEvents);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _sendDataPendingAnimalsPhotos() {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
              var pendingAnimalsPhotos=[];
              var sendAnimalPhotosOnlinePromises = [];
                localDbFactory.getAllAnimalsPhotosLocalDb()
                    .then(function (localAnimalPhotos) {
                        angular.forEach(localAnimalPhotos, function (value, key) {
                          var animalPhotoStatus={
                            type:'AnimalPhoto',
                            animalCode:value.animalCode,
                            status:'NotSynced'
                          };
                          pendingAnimalsPhotos.push(animalPhotoStatus);
                          var animalEventPromise=_sendAnimalPhotoOnlineFromLocalDb(value)
                          .then(function (data) {
                              animalPhotoStatus.sent=true;
                          }).catch(function (error) {
                                animalPhotoStatus.sent=false;
                                animalPhotoStatus.error=error;
                          });
                          sendAnimalPhotosOnlinePromises.push(animalEventPromise);
                        });
                        if (sendAnimalPhotosOnlinePromises.length > 0) {
                            $q.all(sendAnimalPhotosOnlinePromises)
                            .then(function (data) {
                                _getAnimalsAlive(true);
                            });
                        }
                        defer.resolve(pendingAnimalsPhotos);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _sendNewAnimalOnlineFromLocalDb(animal) {
            var defer = $q.defer();
            _checkAnimalCode(animal.code)
                .then(function (data) {
                    if (data) {
                        localDbFactory.removeNewAnimalLocalDb(animal)
                            .then(function (data) {
                                defer.resolve(true);
                            }).catch(function (error) {
                                defer.reject(error);
                            });
                    } else {
                        _saveAnimalOnline(animal)
                            .then(function (data) {
                                return localDbFactory.removeNewAnimalLocalDb(animal);
                            }).then(function (data) {
                                defer.resolve(true);
                            }).catch(function (error) {
                                defer.reject(error);
                            });
                    }
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _sendDataPendingNewAnimals() {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
              var pendingNewAnimals=[];
              var sendNewAnimalOnlinePromises = [];
                localDbFactory.getAllNewAnimalsLocalDb()
                    .then(function (localAnimals) {
                        angular.forEach(localAnimals, function (value, key) {
                            var newAnimalStatus={
                              type:'NewAnimal',
                              animalCode:value.code,
                              status:'NotSynced'
                            };
                            pendingNewAnimals.push(newAnimalStatus);
                            var newAnimalPromise=_sendNewAnimalOnlineFromLocalDb(value)
                            .then(function (data) {
                                newAnimalStatus.sent=true;
                            }).catch(function (error) {
                                  newAnimalStatus.sent=false;
                                  newAnimalStatus.error=error;
                            });
                            sendNewAnimalOnlinePromises.push(newAnimalPromise);
                        });
                        if (sendNewAnimalOnlinePromises.length > 0) {
                            $q.all(sendNewAnimalOnlinePromises)
                            .then(function (data) {
                                _getAnimalsAlive(true);
                            });
                        }
                        defer.resolve({results:pendingNewAnimals,promises:sendNewAnimalOnlinePromises});
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _sendAnimalOnlineFromLocalDb(animal) {
            var defer = $q.defer();
            _saveAnimalOnline(animal)
                .then(function (data) {
                    return localDbFactory.removeAnimalLocalDb(animal);
                }).then(function (data) {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _sendDataPendingAnimals() {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
              var pendingAnimals=[];
              var sendAnimalOnlinePromises = [];
                localDbFactory.getAllAnimalsLocalDb()
                    .then(function (localAnimals) {

                        angular.forEach(localAnimals, function (value, key) {
                          var animalStatus={
                            type:'Animal',
                            animalCode:value.code,
                            status:'NotSynced'
                          };
                          pendingAnimals.push(animalStatus);
                          var animalPromise=_sendAnimalOnlineFromLocalDb(value)
                          .then(function (data) {
                              animalStatus.sent=true;
                          }).catch(function (error) {
                                animalStatus.sent=false;
                                animalStatus.error=error;
                          });
                          sendAnimalOnlinePromises.push(animalPromise);
                        });
                        if (sendAnimalOnlinePromises.length > 0) {
                            $q.all(sendAnimalOnlinePromises)
                            .then(function (data) {
                                _getAnimalsAlive(true);
                            });
                        }
                        defer.resolve(pendingAnimals);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        var _listAnimalsAlive;

        function _getAnimalsAlive(refreshFromServer) {
            var defer = $q.defer();
            if (!refreshFromServer && _listAnimalsAlive) {
                defer.resolve(_listAnimalsAlive);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/animals.json?orderBy="status"&equalTo="alive"&auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        if (data) {
                            angular.forEach(data, function (value, key) {
                                localDbFactory.hasPendingChangesAnimal(value.id)
                                    .then(function (hasPendingChanges) {
                                        value.pendingChanges = hasPendingChanges;
                                    }).catch(function (error) {
                                        value.pendingChanges = false;
                                    });
                            });
                            _listAnimalsAlive = data;
                        } else {
                            _listAnimalsAlive = [];
                        }
                        defer.resolve(_listAnimalsAlive);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };


        function _getAnimalsByAnimalTypeCount(animalType) {
            var defer = $q.defer();
            _getAnimalsAlive(false)
                .then(function (animalsAlive) {
                    if (animalsAlive) {
                        var totalAnimalsAliveOfAnimalType = $linq.Enumerable().From(animalsAlive)
                            .Where(function (x) {
                                return x.Value.type == animalType.id
                            })
                            .Select(function (x) {
                                return x.Value
                            }).Count();
                        defer.resolve(totalAnimalsAliveOfAnimalType);
                    } else {
                        defer.resolve('Could not get the alive animals, please try again');
                    }
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _getAnimalsByAnimalSubTypeCount(animalSubType) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var totalAnimalsAliveOfAnimalType = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.subType == animalSubType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalAnimalsAliveOfAnimalType);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        function _getPinnedAnimals() {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var animalsAlivePinned = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.pinned == true
                        })
                        .Select(function (x) {
                            return x.Value
                        }).ToArray();
                    defer.resolve(animalsAlivePinned);
                } else {
                    defer.resolve('Could not get the pinned animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getAnimalsInFarmByAnimalType(farm, animalType) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var animalsAliveInFarmOfAnimalType = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id && x.Value.type == animalType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).ToArray();
                    defer.resolve(animalsAliveInFarmOfAnimalType);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getAnimalsInFarmByAnimalTypeCount(farm, animalType) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var totalAnimalsAliveInFarmOfAnimalType = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id && x.Value.type == animalType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalAnimalsAliveInFarmOfAnimalType);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getAnimalsInFarmByAnimalSubTypeCount(farm, animalSubType) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var totalAnimalsAliveInFarmOfAnimalSubType = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id && x.Value.subType == animalSubType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalAnimalsAliveInFarmOfAnimalSubType);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getAnimalsInFarmCount(farm) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var totalAnimalsAliveInFarm = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalAnimalsAliveInFarm);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        var _listPlantsAlive;

        function _getPlantsAlive() {
            var defer = $q.defer();
            if (_listPlantsAlive) {
                defer.resolve(_listPlantsAlive);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/plants.json?orderBy="status"&equalTo="alive"&auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        if (data) {
                            _listPlantsAlive = data;
                        } else {
                            _listPlantsAlive = [];
                        }
                        defer.resolve(_listPlantsAlive);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _getPlantsByPlantTypeCount(plantType) {
            var defer = $q.defer();
            _getPlantsAlive().then(function (plantsAlive) {
                if (plantsAlive) {
                    var totalPlantsAliveOfPlantType = $linq.Enumerable().From(plantsAlive)
                        .Where(function (x) {
                            return x.Value.type == plantType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalPlantsAliveOfPlantType);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getPlantsInFarmByPlantType(farm, plantType) {
            var defer = $q.defer();
            _getPlantsAlive().then(function (plantsAlive) {
                if (plantsAlive) {
                    var plantsAliveInFarmOfPlantType = $linq.Enumerable().From(plantsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id && x.Value.type == plantType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).ToArray();
                    defer.resolve(plantsAliveInFarmOfPlantType);
                } else {
                    defer.resolve('Could not get the alive plants, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getPlantsInFarmByPlantTypeCount(farm, plantType) {
            var defer = $q.defer();
            _getPlantsAlive().then(function (plantsAlive) {
                if (plantsAlive) {
                    var totalPlantsAliveInFarmOfPlantType = $linq.Enumerable().From(plantsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id && x.Value.type == plantType.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalPlantsAliveInFarmOfPlantType);
                } else {
                    defer.resolve('Could not get the alive plants, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getPlantsInFarmCount(farm) {
            var defer = $q.defer();
            _getPlantsAlive().then(function (plantsAlive) {
                if (plantsAlive) {
                    var totalPlantsAliveInFarm = $linq.Enumerable().From(plantsAlive)
                        .Where(function (x) {
                            return x.Value.farm == farm.id
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(totalPlantsAliveInFarm);
                } else {
                    defer.resolve('Could not get the alive plants, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getAnimal(animalId) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var animal = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Key == animalId
                        })
                        .Select(function (x) {
                            return x.Value
                        }).ToArray()[0];
                    defer.resolve(animal);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _getAnimalFromCode(animalCode) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var animal = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.code == animalCode
                        })
                        .Select(function (x) {
                            return x.Value
                        }).ToArray()[0];
                    defer.resolve(animal);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _checkAnimalCodeOnline(animalCode) {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/animals.json?orderBy="code"&equalTo="' + animalCode + '"&auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        if (data) {
                            if (!Object.keys(myObject).length)
                                defer.resolve(false);
                            else
                                defer.resolve(true);
                        } else {
                            defer.resolve(false);
                        }
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        }

        function _checkAnimalCodeLocal(animalCode) {
            var defer = $q.defer();
            _getAnimalsAlive(false).then(function (animalsAlive) {
                if (animalsAlive) {
                    var animal = $linq.Enumerable().From(animalsAlive)
                        .Where(function (x) {
                            return x.Value.code == animalCode
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    defer.resolve(animal != 0);
                } else {
                    defer.resolve('Could not get the alive animals, please try again');
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        function _checkAnimalCode(animalCode) {
            var defer = $q.defer();
            _checkAnimalCodeOnline(animalCode).then(function (exist) {
                defer.resolve(exist);
            }).catch(function () {
                _checkAnimalCodeLocal(animalCode).then(function (exist) {
                    defer.resolve(exist);
                }).catch(function (error) {
                    defer.reject(error);
                });
            });
            return defer.promise;
        };

        function _addEventToAnimal(animal, eventObj) {
            var defer = $q.defer();
            eventObj.key = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/events').push().key;
            if ($rootScope.connected) {
                _saveEventInAnimalObjOnline(animal.id, eventObj)
                    .then(function (data) {
                        defer.resolve(data);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            } else {
                localDbFactory.saveAnimalEventLocalDb(animal.id, animal.code, eventObj)
                    .then(function (data) {
                        defer.resolve(data);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _moveAnimal(oldFarm, newFarm, animal) {
            var defer = $q.defer();
            var eventObj = {
                type: 'Movement',
                message: $filter('translate')('FARMMANAGER.EVENTS.DESCRIPTION.ANIMAL_MOVED_FROM_FARM') + ': ' + oldFarm.name + ' ' + $filter('translate')('FARMMANAGER.EVENTS.DESCRIPTION.TO_FARM') + ': ' + newFarm.name,
                date: $filter('date')(new Date(), _dateFormat)
            };
            eventObj.key = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/events').push().key;
            _saveAnimal(animal, newFarm)
                .then(function (data) {
                    if ($rootScope.connected) {
                        return _saveEventInAnimalObjOnline(animal.id, eventObj);
                    } else {
                        return localDbFactory.saveAnimalEventLocalDb(animal.id, animal.code, eventObj);
                    }
                }).then(function (data) {
                    if (data) {
                        defer.resolve(data);
                    }
                }).catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        };

        function _removeAnimal(animal, reason) {
            var defer = $q.defer();
            animal.status = "removed";
            var eventObj = {
                type: reason.key,
                message: reason.reasonText,
                date: $filter('date')(new Date(), _dateFormat)
            };
            _saveAnimal(animal)
                .then(function (data) {
                    return _addEventToAnimal(animal, eventObj);
                }).then(function (data) {
                    if (data) {
                        defer.resolve(data);
                    }
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _sellAnimal(animal) {
            var defer = $q.defer();
            animal.status = "sold";
            var eventObj = {
                type: 'Sold',
                message: $filter('translate')('FARMMANAGER.EVENTS.DESCRIPTION.SOLD'),
                date: $filter('date')(new Date(), _dateFormat)
            };
            _saveAnimal(animal)
                .then(function (data) {
                    return _addEventToAnimal(animal, eventObj);
                }).then(function (data) {
                    if (data) {
                        defer.resolve(data);
                    }
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _getAnimalChilds(animal) {
            var defer = $q.defer();
            defer.resolve(fakeAnimalsData.slice(1, 4));
            return defer.promise;
        }

        function _pinAnimal(animal, pinned) {
            var defer = $q.defer();
            var updates = {};
            updates['/pinned/'] = pinned;
            firebase.database().ref('applications/' + $rootScope.user.appId + '/animals/' + animal.id).update(updates)
                .then(function (data) {
                    //cfpLoadingBar.complete();
                    defer.resolve(true);
                }).catch(function (error) {
                    //cfpLoadingBar.complete();
                    defer.reject(error);
                });
            return defer.promise;
        };

        function _getRemovedReasonAnimalCatalog() {
            var defer = $q.defer();
            var reasons = [
                {
                    id: 1,
                    name: $filter('translate')('FARMMANAGER.MANAGE.ANIMAL.MODAL.REMOVE.DEATH'),
                    key: 'Death'
        },
                {
                    id: 2,
                    name: $filter('translate')('FARMMANAGER.MANAGE.ANIMAL.MODAL.REMOVE.STOLEN'),
                    key: 'Stolen'
        },
                {
                    id: 3,
                    name: $filter('translate')('FARMMANAGER.MANAGE.ANIMAL.MODAL.REMOVE.DISEASE'),
                    key: 'Disease'
        }];
            defer.resolve(reasons);
            return defer.promise;
        };

        function _getNewAnimalObj() {
            var newAnimalObj = {
                "code": "",
                "dateOfBirth": null,
                "events": [],
                "farm": "",
                "farmAnimalSubTypeKey": "",
                "farmAnimalTypeKey": "",
                "farmAnimalTypeSubKey": "",
                "fatherCode": "",
                "id": firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals').push().key,
                "motherCode": "",
                "owner": "",
                "photoUrl": "assets/img/no-animal.jpeg",
                "photos": [],
                "pinned": false,
                "sex": "",
                "subType": "",
                "status": "alive",
                "type": "",
                "weight": ""
            };
            return newAnimalObj;
        };

        function _addAnimal(newAnimal, farm, immageObj) {
            var defer = $q.defer();
            _checkAnimalCode(newAnimal.code).then(function (exists) {
                if (!exists) {
                    if (immageObj) {
                        if (!(immageObj.content && immageObj.imageExtension)) {
                            immageObj = null;
                        }
                    }
                    return _saveAnimal(newAnimal, farm, immageObj, true);
                } else {
                    defer.reject({
                        error: 'This animal code is already used.',
                        message: 'This animal code is already used.'
                    });
                }
            }).then(function (data) {
                if (data) {
                    defer.resolve(data);
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _saveAnimal(animal, farm, immageObj, isNewAnimal) {
            var defer = $q.defer();
            if (animal.dateOfBirth) {
                animal.dateOfBirth = $filter('date')(animal.dateOfBirth, _dateFormat);
            }
            if (farm) {
                animal.farmAnimalTypeKey = farm.id + animal.type;
                animal.farmAnimalSubTypeKey = farm.id + animal.subType;
                animal.farm = farm.id;
            }
            var pendingPromises = [];
            if ($rootScope.connected) {
                _saveAnimalOnline(animal)
                    .then(function (data) {
                        if (isNewAnimal) {
                            var eventObj = {
                                type: 'Born',
                                message: $filter('translate')('FARMMANAGER.EVENTS.DESCRIPTION.BORN'),
                                date: $filter('date')(new Date(), _dateFormat)
                            };
                            eventObj.key = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/events').push().key;
                            pendingPromises.push(_saveEventInAnimalObjOnline(animal.id, eventObj));
                        }
                        if (immageObj) {
                            immageObj.photoKey = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/photos').push().key;
                            immageObj.photoName = immageObj.photoKey + '.' + immageObj.imageExtension;
                            pendingPromises.push(_saveAnimalEventPhotoOnline(animal.id, immageObj));
                        }
                        if (pendingPromises.length > 0) {
                            return $q.all(pendingPromises);
                        } else {
                            defer.resolve(data);
                        }
                    }).then(function (data) {
                        if (data) {
                            if (isNewAnimal) {
                                if (immageObj) {
                                    immageObj = data[1];
                                    immageObj.date = $filter('date')(new Date, _dateFormat);
                                    return _savePhotoInAnimalObjOnline(animal.id, immageObj);
                                } else {
                                    _getAnimalsAlive(true).then(function(){
                                        defer.resolve('1');
                                    }).catch(function(){
                                        defer.resolve('1');
                                    });
                                }
                            } else {
                                if (immageObj) {
                                    immageObj = data[0];
                                    immageObj.date = $filter('date')(new Date, _dateFormat);
                                    return _savePhotoInAnimalObjOnline(animal.id, immageObj);
                                }
                            }
                        }
                    }).then(function (data) {
                        if (data) {
                            _getAnimalsAlive(true).then(function(){
                                        defer.resolve('1');
                                    }).catch(function(){
                                        defer.resolve('1');
                                    });
                        }
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            } else {
                    if (isNewAnimal) {
                        localDbFactory.saveNewAnimalLocalDb(animal)
                            .then(function (data) {
                                if (isNewAnimal) {
                                    var eventObj = {
                                        type: 'Born',
                                        message: $filter('translate')('FARMMANAGER.EVENTS.DESCRIPTION.BORN'),
                                        date: $filter('date')(new Date(), _dateFormat)
                                    };
                                    eventObj.key = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/events').push().key;
                                    pendingPromises.push(localDbFactory.saveAnimalEventLocalDb(animal.id, animal.code, eventObj));
                                }
                                if (immageObj) {
                                    immageObj.photoKey = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/photos').push().key;
                                    immageObj.photoName = immageObj.photoKey + '.' + immageObj.imageExtension;
                                    pendingPromises.push(localDbFactory.saveAnimalPhotoLocalDb(animal.id, animal.code, immageObj));
                                }
                                if (pendingPromises.length > 0) {
                                    return $q.all(pendingPromises);
                                } else {
                                    defer.resolve(data);
                                }
                            }).then(function (data) {
                                if (data) {
                                    defer.resolve('1');
                                }
                            }).catch(function (error) {
                                defer.reject(error);
                            });
                    } else {
                        localDbFactory.saveAnimalLocalDb(animal)
                            .then(function (data) {
                                if (immageObj) {
                                    immageObj.photoKey = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animal.id + '/photos').push().key;
                                    immageObj.photoName = immageObj.photoKey + '.' + immageObj.imageExtension;
                                    return localDbFactory.saveAnimalPhotoLocalDb(animal.id, animal.code, immageObj);
                                } else {
                                    defer.resolve(data);
                                }
                            }).then(function (data) {
                                if (data) {
                                    defer.resolve(data);
                                }
                            }).catch(function (error) {
                                defer.reject(error);
                            });
                    }
            }

            return defer.promise;
        };

        function _saveAnimalOnline(animal) {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
                firebase.database().ref('applications/' + $rootScope.user.appId + '/animals/' + animal.id).set(animal)
                    .then(function (data) {
                        //cfpLoadingBar.complete();
                        defer.resolve(true);
                    }).catch(function (error) {
                        //cfpLoadingBar.complete();
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _savePhotoInAnimalObjOnline(animalId, photo) {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
            firebase.database().ref('applications/' + $rootScope.user.appId + '/animals/' + animalId + '/photos/' + photo.photoKey).set(photo)
                .then(function (data) {
                    var updates = {};
                    updates['/photoUrl/'] = photo.photoUrl;
                    firebase.database().ref('applications/' + $rootScope.user.appId + '/animals/' + animalId).update(updates)
                        .then(function (data) {
                            defer.resolve(true);
                        }).catch(function (error) {
                            defer.reject(error);
                        });
                }).catch(function (error) {
                    defer.reject(error);
                });
              }
            return defer.promise;
        };

        function _saveEventInAnimalObjOnline(animalId, eventObj) {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
            firebase.database().ref('applications/' + $rootScope.user.appId + '/animals/' + animalId + '/events/' + eventObj.key).set(eventObj)
                .then(function (data) {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject(error);
                });
              }
            return defer.promise;
        };

        function _saveAnimalEventPhotoOnline(animalId, immageObj) {
            var defer = $q.defer();
            if (!$rootScope.connected) {
                defer.reject('Please check your connection');
            } else {
            var storageRef = firebase.storage().ref().child('applications/' + $rootScope.user.appId + '/animals/' + animalId + '/photos/' + immageObj.photoKey + '/' + immageObj.photoName);
            //storageRef.putString(immageObj.content.replace(/^data:image\/(jpeg|gif|png|jpg);base64,/, ''), 'base64')
            storageRef.putString(immageObj.content, 'data_url')
                .then(function (snapshot) {
                    defer.resolve({
                        photoKey: immageObj.photoKey,
                        photoName: immageObj.photoName,
                        photoUrl: snapshot.downloadURL
                    });
                }).catch(function (error) {
                    defer.reject(error);
                });
              }
            return defer.promise;
        };

        function _setEventTitle(eventObj) {
            var tKey = '';
            switch (eventObj.type) {
                case 'Born':
                    tKey = 'FARMMANAGER.EVENTS.TYPE.BORN';
                    break;
                case 'Sold':
                    tKey = 'FARMMANAGER.EVENTS.TYPE.SOLD';
                    break;
                case 'Death':
                    tKey = 'FARMMANAGER.EVENTS.TYPE.DEATH';
                    break;
                case 'Stolen':
                    tKey = 'FARMMANAGER.EVENTS.TYPE.STOLEN';
                    break;
                case 'Disease':
                    tKey = 'FARMMANAGER.EVENTS.TYPE.DISEASE';
                    break;
                case 'Movement':
                    tKey = 'FARMMANAGER.EVENTS.TYPE.MOVEMENT';
                    break;
                default:
                    tKey = 'FARMMANAGER.EVENTS.TYPE.USER';
                    break;
            }
            return $filter('translate')(tKey);
        }

        function _getEventLogo(eventObj) {
            switch (eventObj.type) {
                case 'Born':
                    return 'icon-plus';
                case 'Sold':
                    return 'icon-coin';
                case 'Death':
                    return 'icon-security';
                case 'Stolen':
                    return 'icon-security';
                case 'Disease':
                    return 'icon-security';
                case 'Movement':
                    return 'icon-truck';
                default:
                    return 'icon-account';
            }
        }

        function _getEventColor(eventObj) {
            switch (eventObj.type) {
                case 'Born':
                    return '';
                case 'Sold':
                    return 'success';
                case 'Death':
                    return 'danger';
                case 'Stolen':
                    return 'danger';
                case 'Disease':
                    return 'danger';
                case 'Movement':
                    return 'info';
                default:
                    return 'warning';
            }
        };

        function _getPendingTypeTitle(pendingType) {
            switch (pendingType) {
                case 'NewAnimal':
                    return $filter('translate')('FARMMANAGER.PENDINGDATA.NEWANIMAL');
                case 'Animal':
                    return $filter('translate')('FARMMANAGER.PENDINGDATA.ANIMAL');
                case 'AnimalEvent':
                    return $filter('translate')('FARMMANAGER.PENDINGDATA.ANIMALEVENT');
                case 'AnimalPhoto':
                    return $filter('translate')('FARMMANAGER.PENDINGDATA.ANIMALPHOTO');
            }
        };
    };


}());
