(function () {
    'use strict';

    angular
        .module('app.farmmanager', ['dark-sky', 'chart.js', 'flow', 'ngMap', 'angular-linq', 'ngdexie', 'ngdexie.ui', 'ngPapaParse'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, darkSkyProvider, ngDexieProvider) {
        // State

        darkSkyProvider.setApiKey('');
        darkSkyProvider.setLanguage('es');
        darkSkyProvider.setUnits('si');
        ngDexieProvider.setOptions({
            name: 'farmMangerDixieDB',
            debug: false
        });
        ngDexieProvider.setConfiguration(function (db) {
            db.version(1).stores({
                animals: 'id,&code',
                animalsEvents: 'key',
                animalsPhotos: 'key,&photoName',
                newAnimals: 'id,&code'
            });
            db.on('error', function (err) {
                // Catch all uncatched DB-related errors and exceptions
                console.error("db error err=" + err);
            });
        });

        $stateProvider
            .state('app.farmmanager', {
                url: '/farmmanager',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/farmmanager.html',
                        controller: 'SampleController as model'
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.pendingData', {
                url: '/farmmanager/pendingdata/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/pendingData/pendingData.html',
                        controller: 'pendingDataCtrl as model',
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.manageListFarms', {
                url: '/farmmanager/manage/farms/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/manage/farm/listFarms/listFarms.html',
                        controller: 'manageListFarmsCtrl as model',
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.manageFarm', {
                url: '/farmmanager/manage/farm/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/manage/farm/farm/farm.html',
                        controller: 'manageFarmCtrl as model',
                        params: {
                            farm: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.manageListAnimals', {
                url: '/farmmanager/manage/farm/:farmId/animals/:animalTypeId',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/manage/animal/listAnimals/listAnimals.html',
                        controller: 'manageListAnimalsCtrl as model',
                        params: {
                            farm: null,
                            animalType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.manageImportAnimals', {
                url: '/farmmanager/manage/farm/:farmId/animals/:animalTypeId/import',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/manage/animal/importAnimals/importAnimals.html',
                        controller: 'manageImportAnimalsCtrl as model',
                        params: {
                            farm: null,
                            animalType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.manageAnimal', {
                url: '/farmmanager/manage/farm/:farmId/animals/:animalTypeId/manage/:animalId',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/manage/animal/animal/animal.html',
                        controller: 'manageAnimalCtrl as model',
                        params: {
                            farm: null,
                            animalType: null,
                            animal: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.manageAddAnimal', {
                url: '/farmmanager/manage/farm/:farmId/animals/:animalTypeId/manage/add/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/manage/animal/addAnimal/addAnimal.html',
                        controller: 'manageAddAnimalCtrl as model',
                        params: {
                            farm: null,
                            animalType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationListFarms', {
                url: '/farmmanager/systemConfiguration/farms/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/farms/listFarms/listFarms.html',
                        controller: 'systemConfigurationListFarmsCtrl as model',
                        params: {
                            farm: null,
                            animalType: null,
                            animal: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationAddFarm', {
                url: '/farmmanager/systemConfiguration/farms/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/farms/addFarm/farm.html',
                        controller: 'systemConfigurationAddFarmCtrl as model',
                        params: {},
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                },
                onEnter: function (connectionFactory) {
                    connectionFactory.checkOffline(true);
                }
            }).state('app.farmmanager.systemConfigurationFarm', {
                url: '/farmmanager/systemConfiguration/farms/:farmId',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/farms/farm/farm.html',
                        controller: 'systemConfigurationFarmCtrl as model',
                        params: {
                            farm: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationListAnimalTypes', {
                url: '/farmmanager/systemConfiguration/animals/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/animalTypes/listAnimalTypes/listAnimalTypes.html',
                        controller: 'systemConfigurationListAnimalTypesCtrl as model',
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationAddAnimalType', {
                url: '/farmmanager/systemConfiguration/animalTypes/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/animalTypes/addAnimalType/animalType.html',
                        controller: 'systemConfigurationAddAnimalTypeCtrl as model',
                        params: {},
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                },
                onEnter: function (connectionFactory) {
                    connectionFactory.checkOffline(true);
                }
            }).state('app.farmmanager.systemConfigurationAnimalType', {
                url: '/farmmanager/systemConfiguration/animalTypes/:animalTypeId',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/animalTypes/animalType/animalType.html',
                        controller: 'systemConfigurationAnimalTypeCtrl as model',
                        params: {
                            animalType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationListAnimalSubTypes', {
                url: '/farmmanager/systemConfiguration/animalTypes/:animalTypeId/animalSubTypes',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/animalSubTypes/listAnimalSubTypes/listAnimalSubTypes.html',
                        controller: 'systemConfigurationListAnimalSubTypesCtrl as model',
                        params: {
                            animalType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationAddAnimalSubType', {
                url: '/farmmanager/systemConfiguration/animalTypes/:animalTypeId/animalSubTypes/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/animalSubTypes/addAnimalSubType/animalSubType.html',
                        controller: 'systemConfigurationAddAnimalSubTypeCtrl as model',
                        params: {
                            animalType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                },
                onEnter: function (connectionFactory) {
                    connectionFactory.checkOffline(true);
                }
            }).state('app.farmmanager.systemConfigurationAnimalSubType', {
                url: '/farmmanager/systemConfiguration/animalTypes/:animalTypeId/animalSubTypes/:animalSubTypeId',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/animalSubTypes/animalSubType/animalSubType.html',
                        controller: 'systemConfigurationAnimalSubTypeCtrl as model',
                        params: {
                            animalType: null,
                            animalSubType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationListPlantTypes', {
                url: '/farmmanager/systemConfiguration/plants/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/plantTypes/listPlantTypes/listPlantTypes.html',
                        controller: 'systemConfigurationListPlantTypesCtrl as model',
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            }).state('app.farmmanager.systemConfigurationAddPlantType', {
                url: '/farmmanager/systemConfiguration/plantTypes/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/plantTypes/addPlantType/plantType.html',
                        controller: 'systemConfigurationAddPlantTypeCtrl as model',
                        params: {},
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                },
                onEnter: function (connectionFactory) {
                    connectionFactory.checkOffline(true);
                }
            }).state('app.farmmanager.systemConfigurationPlantType', {
                url: '/farmmanager/systemConfiguration/plantTypes/:plantTypeId',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/farmmanager/systemConfiguration/plantTypes/plantType/plantType.html',
                        controller: 'systemConfigurationPlantTypeCtrl as model',
                        params: {
                            plantType: null
                        },
                    }
                },
                resolve: {
                    appIntLoaded: function (loginFactory) {
                        return loginFactory.checkUserAunthentication();
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/farmmanager');


        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title: 'FARMMANAGER',
            group: true,
            weight: 1
        });


    }
})();
