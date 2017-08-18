(function () {
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, $rootScope, loginFactory, connectionFactory, $mdToast, $state, $anchorScroll, localDbFactory) {
        var model = this;
        model.user = {
            fullName: '',
            email: '',
            password: '',
            newPassword: '',
            newPasswordConfirm: '',
            appKey: '',
            autoSendData: false
        };
        model.copyUser = {};
        model.editMode = false;
        model.passwordFocus = false;

        if ($rootScope.user) {
            model.user.fullName = $rootScope.user.displayName;
            model.user.email = $rootScope.user.email;
            model.user.appKey = $rootScope.user.appId;
            model.user.autoSendData = $rootScope.user.autoSendData;
        }

        model.editProfile = function () {
            if (!connectionFactory.checkOffline(false))
                return;
            model.editMode = true;
            model.passwordFocus = true;
            angular.copy(model.user, model.copyUser);
        }

        model.cancel = function () {
            $anchorScroll();
            model.editMode = false;
            angular.copy(model.copyUser, model.user);
        }

        model.save = function () {
            if (model.user.fullName != $rootScope.user.displayName ||
                model.user.email != $rootScope.user.email ||
                model.user.newPassword != '' ||
                model.user.autoSendData != $rootScope.user.autoSendData) {
                if (model.user.newPassword != '' && model.user.newPassword != model.user.newPasswordConfirm) {
                    $mdToast.show(
                        $mdToast.simple().textContent("New password dosen't match with confirmation")
                    );
                    return false;
                }
                loginFactory.reauthenticate(model.user.password).then(function () {
                    model.user.password = '';
                    loginFactory.updateUser(model.user).then(function (data) {
                        if (model.user.newPassword != '') {
                            model.user.newPassword = '';
                            model.user.newPasswordConfirm = '';
                        }
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('User info updated!')
                        );
                        model.editMode = false;
                    }).catch(function (error) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(error)
                        );
                    });
                }).catch(function (error) {
                    model.user.password = '';
                    model.user.newPassword = '';
                    model.user.newPasswordConfirm = '';
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(error.message)
                    );
                })
            }
        }

        // Data
        model.posts = [];
        model.activities = [];
        model.about = [];
        model.photosVideos = [];

        getPendingNewAnimals();

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

        getPendingAnimals();

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


        getPendingAnimalsPhotos();

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

        getPendingAnimalsEvents();

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

        model.deleteLocalStorage = function () {
            localDbFactory.clearDb()
                .then(function (data) {
                    $mdToast.show(
                        $mdToast.simple().textContent('All your local data was deleted successfully')
                    );
                    getPendingNewAnimals();
                    getPendingAnimals();
                    getPendingAnimalsPhotos();
                    getPendingAnimalsEvents();
                }).catch(function (error) {
                    $mdToast.show(
                        $mdToast.simple().textContent(error)
                    );
                });
        };
        // Methods

        //////////
    }

})();
