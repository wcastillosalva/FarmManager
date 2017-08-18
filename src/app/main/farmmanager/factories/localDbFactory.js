(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .factory('localDbFactory', localDbFactory);

    /** @ngInject */
    function localDbFactory($q, ngDexie, $linq, $rootScope) {
        return {
            getAllPendingCountLocalDb:_getAllPendingCountLocalDb,

            getAllNewAnimalsCountLocalDb: _getAllNewAnimalsCountLocalDb,
            getAllAnimalsCountLocalDb: _getAllAnimalsCountLocalDb,
            getAllAnimalsPhotosCountLocalDb: _getAllAnimalsPhotosCountLocalDb,
            getAllAnimalsEventsCountLocalDb: _getAllAnimalsEventsCountLocalDb,

            getAllNewAnimalsLocalDb: _getAllNewAnimalsLocalDb,
            getAllAnimalsLocalDb: _getAllAnimalsLocalDb,
            getAllAnimalsPhotosLocalDb: _getAllAnimalsPhotosLocalDb,
            getAllAnimalsEventsLocalDb: _getAllAnimalsEventsLocalDb,

            saveNewAnimalLocalDb: _saveNewAnimalLocalDb,
            saveAnimalLocalDb: _saveAnimalLocalDb,
            saveAnimalPhotoLocalDb: _saveAnimalPhotoLocalDb,
            saveAnimalEventLocalDb: _saveAnimalEventLocalDb,

            removeAnimalPhotoLocalDb: _removeAnimalPhotoLocalDb,
            removeNewAnimalLocalDb: _removeNewAnimalLocalDb,
            removeAnimalLocalDb: _removeAnimalLocalDb,
            removeAnimalEventLocalDb: _removeAnimalEventLocalDb,

            hasPendingChangesAnimal: _hasPendingChangesAnimal,
            clearDb: _clearDb
        }
        function _getAllPendingCountLocalDb(){
            var defer = $q.defer()
            $q.all([_getAllNewAnimalsCountLocalDb(),
              _getAllAnimalsCountLocalDb(),
              _getAllAnimalsPhotosCountLocalDb(),
              _getAllAnimalsEventsCountLocalDb()
            ]).then(function(data){
                var sum = data.reduce(add, 0);
                defer.resolve(sum);
            }).catch(function(error){
                defer.reject(error);
            });
            return defer.promise;
        };

        function add(a, b) {
            return a + b;
        };

        function _getAllAnimalsPhotosCountLocalDb() {
            var defer = $q.defer()
            ngDexie.getDb().animalsPhotos.count()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the saved animal photos, please try again');
                });
            return defer.promise;
        };

        function _getAllNewAnimalsCountLocalDb() {
            var defer = $q.defer();
            ngDexie.getDb().newAnimals.count()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the new saved animals, please try again');
                });
            return defer.promise;
        };

        function _getAllAnimalsCountLocalDb() {
            var defer = $q.defer();
            ngDexie.getDb().animals.count()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get pending changes for animals, please try again');
                });
            return defer.promise;
        };

        function _getAllAnimalsEventsCountLocalDb() {
            var defer = $q.defer()
            ngDexie.getDb().animalsEvents.count()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the saved animal photos, please try again');
                });
            return defer.promise;
        };

        function _getAllAnimalsEventsLocalDb() {
            var defer = $q.defer();
            ngDexie.getDb().animalsEvents.toArray()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the saved animal events, please try again');
                });
            return defer.promise;
        };

        function _getAllAnimalsPhotosLocalDb() {
            var defer = $q.defer();
            ngDexie.getDb().animalsPhotos.toArray()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the saved animal photos, please try again');
                });
            return defer.promise;
        };

        function _getAllNewAnimalsLocalDb() {
            var defer = $q.defer();
            ngDexie.getDb().newAnimals.toArray()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the saved new animals, please try again');
                });
            return defer.promise;
        };

        function _hasPendingChangesAnimal(animalId) {
            var defer = $q.defer()
            ngDexie.getDb().animals.get(animalId)
                .then(function (data) {
                    defer.resolve(!!data);
                }).catch(function (error) {
                    defer.resolve(false);
                });
            return defer.promise;
        };

        function _getAllAnimalsLocalDb() {
            var defer = $q.defer();
            ngDexie.getDb().animals.toArray()
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not get the saved new animals, please try again');
                });
            return defer.promise;
        };

        function _saveNewAnimalLocalDb(animal) {
            var defer = $q.defer();
            ngDexie.getDb().newAnimals.add(animal)
                .then(function () {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject({
                        error: 'This animal code is already used.',
                        message: 'This animal code is already used.'
                    });
                });
            return defer.promise;
        };

        function _saveAnimalLocalDb(animal) {
            var defer = $q.defer();
            ngDexie.getDb().animals.add(animal)
                .then(function () {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject({
                        error: 'This animal code has pending changes to be sent.',
                        message: 'This animal code has pending changes to be sent.'
                    });
                });
            return defer.promise;
        };

        function _saveAnimalPhotoLocalDb(animalId, animalCode, immageObj) {
            var defer = $q.defer();
            var animalPhoto = {
                "key": immageObj.photoKey,
                "photoName": immageObj.photoName,
                "content": immageObj.content,
                "animalId": animalId,
                "animalCode" : animalCode
            };
            ngDexie.getDb().animalsPhotos.add(animalPhoto)
                .then(function () {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject({
                        error: 'This animal code has pending changes to be sent.',
                        message: 'This animal code has pending changes to be sent.'
                    });
                });
            return defer.promise;
        };

        function _saveAnimalEventLocalDb(animalId, animalCode, eventObj) {
            var defer = $q.defer();
            eventObj.animalId = animalId;
            eventObj.animalCode=animalCode;
            ngDexie.getDb().animalsEvents.add(eventObj)
                .then(function () {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject({
                        error: 'This animal code has pending events to be sent.',
                        message: 'This animal code has pending events to be sent.'
                    });
                });
            return defer.promise;
        };

        function _removeAnimalEventLocalDb(eventObj) {
            var defer = $q.defer();
            ngDexie.getDb().animalsEvents.delete(eventObj.key)
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not delete the animal event from local db with code ' + animal.code + ', please try again');
                });
            return defer.promise;
        };

        function _removeAnimalPhotoLocalDb(photo) {
            var defer = $q.defer();
            ngDexie.getDb().animalsPhotos.delete(photo.key)
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not delete the animal photo from local db with code ' + animal.code + ', please try again');
                });
            return defer.promise;
        };

        function _removeNewAnimalLocalDb(animal) {
            var defer = $q.defer();
            ngDexie.getDb().newAnimals.delete(animal.id)
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not delete the new animal from local db with code ' + animal.code + ', please try again');
                });
            return defer.promise;
        };

        function _removeAnimalLocalDb(animal) {
            var defer = $q.defer();
            ngDexie.getDb().animals.delete(animal.id)
                .then(function (data) {
                    defer.resolve(data);
                }).catch(function (error) {
                    defer.reject('Could not delete the animal from local db with code ' + animal.code + ', please try again');
                });
            return defer.promise;
        };

        function _clearDb() {
            var defer = $q.defer();
            var clearPromises = [];
            clearPromises.push(ngDexie.getDb().newAnimals.clear());
            clearPromises.push(ngDexie.getDb().animals.clear());
            clearPromises.push(ngDexie.getDb().animalsPhotos.clear());
            clearPromises.push(ngDexie.getDb().animalsEvents.clear());
            $q.all(clearPromises)
                .then(function (data) {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject('There was an error clearing your local data please try again');
                });
            return defer.promise;
        };


    }
}());
