(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .factory('adminFactory', adminFactory);

    /** @ngInject */
    function adminFactory($q, $http, $timeout, $rootScope, $linq) {
        return {
            getFarms2: _getFarms2,
            getFarms: _getFarms,
            getFarm: _getFarm,
            addFarm: _addFarm,
            saveFarm: _saveFarm,
            deleteFarm: _deleteFarm,

            getAnimalTypesForFarm: _getAnimalTypesForFarm,
            includeAnimalTypeInFarm: _includeAnimalTypeInFarm,
            excludeAnimalTypeInFarm: _excludeAnimalTypeInFarm,

            getPlantTypesForFarm: _getPlantTypesForFarm,
            includePlantTypeInFarm: _includePlantTypeInFarm,
            excludePlantTypeInFarm: _excludePlantTypeInFarm,

            getAnimalTypes: _getAnimalTypes,
            getAnimalType: _getAnimalType,
            addAnimalType: _addAnimalType,
            saveAnimalType: _saveAnimalType,
            deleteAnimalType: _deleteAnimalType,

            getAnimalSubTypes: _getAnimalSubTypes,
            getAnimalSubTypesCount: _getAnimalSubTypesCount,
            getAnimalSubType: _getAnimalSubType,
            addAnimalSubType: _addAnimalSubType,
            saveAnimalSubType: _saveAnimalSubType,
            deleteAnimalSubType: _deleteAnimalSubType,

            getPlantTypes: _getPlantTypes,
            addPlantType: _addPlantType,
            savePlantType: _savePlantType,
            getPlantType: _getPlantType,
            deletePlantType: _deletePlantType,

            checkAnimalTypeInFarm: _checkAnimalTypeInFarm
        };

        var _listFarms;

        function *_getFarms2() {
              if(_listFarms){
                return _listFarms;
              }
              else{
                var response =yield fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/farms.json?auth=' + $rootScope.user.token);
                var data = yield response.json();
                _listFarms=data;
                return data;
              }
        };

        function _getFarms() {
            var defer = $q.defer();
            if (_listFarms) {              
                defer.resolve(_listFarms);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/farms.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        _listFarms = data;
                        defer.resolve(_listFarms);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _getFarm(farmId) {
            var defer = $q.defer();
            var farm;
            if (_listFarms) {
                farm = $linq.Enumerable().From(_listFarms)
                    .Where(function (x) {
                        return x.Key == farmId
                    })
                    .Select(function (x) {
                        return x.Value
                    }).ToArray()[0];
            }
            if (farm) {
                defer.resolve(farm);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/farms/' + farmId + '.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        farm = data;
                        defer.resolve(farm);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _addFarm(newFarm) {
            var defer = $q.defer();

            newFarm.id = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/farms').push().key;
            firebase.database().ref('applications/' + $rootScope.user.appId + '/farms/' + newFarm.id).set(newFarm).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _saveFarm(farm) {
            var defer = $q.defer();

            firebase.database().ref('applications/' + $rootScope.user.appId + '/farms/' + farm.id).set(farm).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _deleteFarm(farm) {
            var defer = $q.defer();

            var farmRef = firebase.database().ref('applications/' + $rootScope.user.appId + '/farms/' + farm.id);
            farmRef.remove(function (error) {
                if (error) {
                    defer.reject(false);
                } else {
                    defer.resolve(true);
                }
            });
            return defer.promise;
        };

        function _getAnimalTypesForFarm(farm, getAll) {
            var defer = $q.defer();
            _getAnimalTypes().then(function (data) {
                if (getAll) {
                    angular.forEach(farm.associatedAnimalTypes, function (value, key) {
                        angular.forEach(data, function (value2, key2) {
                            if (value == value2.id) {
                                value2.included = true;
                            }
                        });

                    });
                    defer.resolve(data);
                } else {
                    var animalTypes = [];
                    angular.forEach(farm.associatedAnimalTypes, function (value, key) {
                        angular.forEach(data, function (value2, key2) {
                            if (value == value2.id) {
                                animalTypes.push(value2);
                            }
                        });

                    });
                    defer.resolve(animalTypes);
                }

            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _includeAnimalTypeInFarm(farm, animalType) {
            if (farm.associatedAnimalTypes == undefined)
                farm.associatedAnimalTypes = [];
            farm.associatedAnimalTypes.push(animalType.id);
            return _saveFarm(farm);
        };

        function _excludeAnimalTypeInFarm(farm, animalType) {
            farm.associatedAnimalTypes.splice(farm.associatedAnimalTypes.indexOf(animalType.id), 1);
            return _saveFarm(farm);
        };

        function _getPlantTypesForFarm(farm, getAll) {
            var defer = $q.defer();
            _getPlantTypes().then(function (data) {
                if (getAll) {
                    angular.forEach(farm.associatedPlantTypes, function (value, key) {
                        angular.forEach(data, function (value2, key2) {
                            if (value == value2.id) {
                                value2.included = true;
                            }
                        });
                    });
                    defer.resolve(data);
                } else {
                    var plantTypes = [];
                    angular.forEach(farm.associatedPlantTypes, function (value, key) {
                        angular.forEach(data, function (value2, key2) {
                            if (value == value2.id) {
                                plantTypes.push(value2);
                            }
                        });

                    });
                    defer.resolve(plantTypes);
                }
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _includePlantTypeInFarm(farm, plantType) {
            if (farm.associatedPlantTypes == undefined)
                farm.associatedPlantTypes = [];
            farm.associatedPlantTypes.push(plantType.id);
            return _saveFarm(farm);
        };

        function _excludePlantTypeInFarm(farm, plantType) {
            farm.associatedPlantTypes.splice(farm.associatedPlantTypes.indexOf(plantType.id), 1);
            return _saveFarm(farm);
        };

        var _listAnimalTypes;

        function _getAnimalTypes() {
            var defer = $q.defer();
            if (_listAnimalTypes) {
                defer.resolve(_listAnimalTypes);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/animalTypes.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        _listAnimalTypes = data;
                        defer.resolve(_listAnimalTypes);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        }

        function _getAnimalType(animalTypeId) {
            var defer = $q.defer();
            var animalType;
            if (_listAnimalTypes) {
                animalType = $linq.Enumerable().From(_listAnimalTypes)
                    .Where(function (x) {
                        return x.Key == animalTypeId
                    })
                    .Select(function (x) {
                        return x.Value
                    }).ToArray()[0];
            }
            if (animalType) {
                defer.resolve(animalType);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/animalTypes/' + animalTypeId + '.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        animalType = data;
                        defer.resolve(animalType);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _addAnimalType(newType) {
            var defer = $q.defer();

            newType.id = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animalTypes').push().key;
            firebase.database().ref('applications/' + $rootScope.user.appId + '/animalTypes/' + newType.id).set(newType).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;

        };

        function _saveAnimalType(animalType) {
            var defer = $q.defer();

            firebase.database().ref('applications/' + $rootScope.user.appId + '/animalTypes/' + animalType.id).set(animalType).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;

        };

        function _deleteAnimalType(type) {
            var defer = $q.defer();

            var animalSubTypeRef = firebase.database().ref('applications/' + $rootScope.user.appId + '/animalSubTypes/').orderByChild('parentType');
            animalSubTypeRef.equalTo(type.id).on('value', function (snapshot) {
                if (snapshot.numChildren() == 0) {
                    var animalTypeRef2 = firebase.database().ref('applications/' + $rootScope.user.appId + '/animalTypes/' + type.id);
                    animalTypeRef2.remove(function (error) {
                        if (error) {
                            defer.reject(error);
                        } else {
                            defer.resolve(true);
                        }
                    });
                } else {
                    defer.reject({
                        error: false,
                        message: 'There is one or more animal subtype assigned to this animal type!'
                    });
                }
            }, function (errorObject) {
                defer.reject(errorObject);
            });

            return defer.promise;

        };

        var _listAnimalSubTypes;

        function _getAnimalSubTypes(animalType) {
            var defer = $q.defer();
            var animalSubTypes;
            if (_listAnimalSubTypes) {
                animalSubTypes = $linq.Enumerable().From(_listAnimalSubTypes)
                    .Where(function (x) {
                        return x.Value.parentType == animalType.id
                    })
                    .Select(function (x) {
                        return x.Value
                    }).ToArray();
            }
            if (animalSubTypes) {
                defer.resolve(animalSubTypes);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/animalSubTypes.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        _listAnimalSubTypes = data;
                        animalSubTypes = $linq.Enumerable().From(_listAnimalSubTypes)
                            .Where(function (x) {
                                return x.Value.parentType == animalType.id
                            })
                            .Select(function (x) {
                                return x.Value
                            }).ToArray();
                        defer.resolve(animalSubTypes);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        }

        function _getAnimalSubType(animalSubTypeId) {
            var defer = $q.defer();
            var animalSubType;
            if (_listAnimalSubTypes) {
                animalSubType = $linq.Enumerable().From(_listAnimalSubTypes)
                    .Where(function (x) {
                        return x.Key == animalSubTypeId
                    })
                    .Select(function (x) {
                        return x.Value
                    }).ToArray()[0];
            }
            if (animalSubType) {
                defer.resolve(animalSubType);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/animalSubTypes/' + animalSubTypeId + '.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        animalSubType = data;
                        defer.resolve(animalSubType);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _getAnimalSubTypesCount(animalType) {
            var defer = $q.defer();
            _getAnimalSubTypes(animalType).then(function (data) {
                defer.resolve(data.length);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _addAnimalSubType(newSubType) {
            var defer = $q.defer();

            newSubType.id = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/animalSubTypes').push().key;
            firebase.database().ref('applications/' + $rootScope.user.appId + '/animalSubTypes/' + newSubType.id).set(newSubType).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;

        };

        function _saveAnimalSubType(newSubType) {
            var defer = $q.defer();

            firebase.database().ref('applications/' + $rootScope.user.appId + '/animalSubTypes/' + newSubType.id).set(newSubType).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;

        };

        function _deleteAnimalSubType(subType) {
            var defer = $q.defer();

            var animalSubTypeRef = firebase.database().ref('applications/' + $rootScope.user.appId + '/animalSubTypes/' + subType.id);
            animalSubTypeRef.remove(function (error) {
                if (error) {
                    defer.reject(false);
                } else {
                    defer.resolve(true);
                }
            });
            return defer.promise;

        };

        var _listplantTypes;

        function _getPlantTypes() {
            var defer = $q.defer();
            if (_listplantTypes) {
                defer.resolve(_listplantTypes);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/plantTypes.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        _listplantTypes = data;
                        defer.resolve(_listplantTypes);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        }

        function _getPlantType(plantTypeId) {
            var defer = $q.defer();
            var plantType;
            if (_listplantTypes) {
                plantType = $linq.Enumerable().From(_listplantTypes)
                    .Where(function (x) {
                        return x.Key == plantTypeId
                    })
                    .Select(function (x) {
                        return x.Value
                    }).ToArray()[0];
            }
            if (plantType) {
                defer.resolve(plantType);
            } else {
                fetch('https://' + $rootScope.user.proyect + '/applications/' + $rootScope.user.appId + '/plantTypes/' + plantTypeId + '.json?auth=' + $rootScope.user.token)
                    .then(function (data) {
                        return data.json();
                    }).then(function (data) {
                        plantType = data;
                        defer.resolve(plantType);
                    }).catch(function (error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        };

        function _addPlantType(newType) {
            var defer = $q.defer();

            newType.id = firebase.database().ref().child('applications/' + $rootScope.user.appId + '/plantTypes').push().key;
            firebase.database().ref('applications/' + $rootScope.user.appId + '/plantTypes/' + newType.id).set(newType).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;

        };

        function _savePlantType(plantType) {
            var defer = $q.defer();

            firebase.database().ref('applications/' + $rootScope.user.appId + '/plantTypes/' + plantType.id).set(plantType).then(function (data) {
                defer.resolve(true);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;

        };

        function _deletePlantType(type) {
            var defer = $q.defer();

            var plantTypeRef = firebase.database().ref('applications/' + $rootScope.user.appId + '/plantTypes/' + type.id);
            plantTypeRef.remove(function (error) {
                if (error) {
                    defer.reject(false);
                } else {
                    defer.resolve(true);
                }
            });
            return defer.promise;

        };

        function _checkAnimalTypeInFarm(farm, animalTypeId) {
            var hasAnimalType = false;
            var defer = $q.defer();
            _getAnimalTypesForFarm(farm, false)
                .then(function (data) {
                    var hasAnimalType = $linq.Enumerable().From(data)
                        .Where(function (x) {
                            return x.id == animalTypeId
                        })
                        .Select(function (x) {
                            return x.Value
                        }).Count();
                    if (hasAnimalType > 0) {
                        defer.resolve(true);
                    } else {
                        defer.reject({
                            success: false,
                            message: "This farm dosen't have this animal type associated"
                        });
                    }
                }).catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };
    };
}());
