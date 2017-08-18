(function () {
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($scope, $rootScope, $q, $state, $timeout, $mdSidenav, $translate, $mdToast, msNavigationService, loginFactory, $filter, manageFactory, adminFactory, safeApply, $mdDialog, localStorageFactory) {
        var vm = this;

        // Data
        $rootScope.global = {
            search: ''
        };

        vm.changeConnectionStatus = function () {
            var farmManagerObj = localStorageFactory.getValue();
            if ($rootScope.connected) {
                firebase.database().goOffline();
                var farmManagerObj = localStorageFactory.getValue();
                if (farmManagerObj.rememberStayOffline == null || farmManagerObj.rememberStayOffline == undefined)
                    showAlert();
            } else{
                firebase.database().goOnline();
                var farmManagerObj = localStorageFactory.getValue();
                farmManagerObj.rememberStayOffline = null;
                localStorageFactory.setValue(farmManagerObj);
            }

        };

        function showMessage(message) {
            $mdToast.show({
                template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                hideDelay: 7000,
                position: 'top right',
                parent: '#content'
            });
        }

        $rootScope.$on('connectionChangeEvent', function (event, data) {
            vm.disconnected = !$rootScope.connected;
            var message = '';
            if (vm.disconnected) {
                message = $filter('translate')('TOOLBAR.DISCONNECTED_MESSAGE');
                showMessage(message);
            } else {
                showMessage($filter('translate')('TOOLBAR.CONNECTED_MESSAGE'));
                if ($rootScope.user.autoSendData) {
                    manageFactory.sendAllPendingData()
                        .then(function (data) {
                            if (data) {
                                showMessage($filter('translate')('TOOLBAR.DATA_AUTO_SEND_SUCCESS'));
                                $rootScope.refreshPendingDataMonitor = true;
                            }
                        }).catch(function (error) {
                            showMessage(error);
                        });
                }
            }

        });

        if ($rootScope.user) {
            vm.userName = $rootScope.user.displayName;
        }

        vm.useCustomSearch = $rootScope.useCustomSearch;
        $rootScope.$on('useCustomSearchChangeEvent', function (event, args) {
            if ($rootScope.useCustomSearch) {
                vm.useCustomSearch = $rootScope.useCustomSearch;
            } else {
                vm.useCustomSearch = false;
            }
        });

        vm.bodyEl = angular.element('body');
        vm.languages = {
            en: {
                'title': 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code': 'en',
                'flag': 'us'
            },
            es: {
                'title': 'Spanish',
                'translation': 'TOOLBAR.SPANISH',
                'code': 'es',
                'flag': 'es'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;
        vm.clearSearch = _clearSearch;
        //////////

        init();

        /**
         * Initialize
         */
        function init() {
            // Select the first status as a default
            //vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status) {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout() {
            loginFactory.logout();
            $state.go('app.login-v2');
        }

        /**
         * Change Language
         */
        function changeLanguage(lang) {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            if (!(lang.code == 'en' || lang.code == 'es')) {
                var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

                $mdToast.show({
                    template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 7000,
                    position: 'top right',
                    parent: '#content'
                });

                return;
            }

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu() {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }

        /**
         * Toggle msNavigation folded
         */
        function toggleMsNavigationFolded() {
            msNavigationService.toggleFolded();
        }

        function _clearSearch() {
            if (vm.useCustomSearch) {
                $rootScope.searchedText = '';
                $rootScope.$emit('searchedTextChangeEvent', []);
            }
        }
        /**
         * Search action
         *
         * @param query
         * @returns {Promise}
         */
        function search(query) {

            if (vm.useCustomSearch) {
                $rootScope.searchedText = query;
                $rootScope.$emit('searchedTextChangeEvent', []);
            }


            var navigation = [],
                flatNavigation = msNavigationService.getFlatNavigation(),
                deferred = $q.defer();

            // Iterate through the navigation array and
            // make sure it doesn't have any groups or
            // none ui-sref items
            for (var x = 0; x < flatNavigation.length; x++) {
                if (flatNavigation[x].uisref) {
                    navigation.push(flatNavigation[x]);
                }
            }

            // If there is a query, filter the navigation;
            // otherwise we will return the entire navigation
            // list. Not exactly a good thing to do but it's
            // for demo purposes.
            if (query) {
                navigation = navigation.filter(function (item) {
                    if (angular.lowercase(item.title).search(angular.lowercase(query)) > -1) {
                        return true;
                    }
                });
            }

            // Fake service delay
            $timeout(function () {
                deferred.resolve(navigation);
            }, 1000);

            return deferred.promise;
        }

        /**
         * Search result click action
         *
         * @param item
         */
        function searchResultClick(item) {
            // If item has a link
            if (item.uisref) {
                // If there are state params,
                // use them...
                if (item.stateParams) {
                    $state.go(item.state, item.stateParams);
                } else {
                    $state.go(item.state);
                }
            }
        }

        // Activate loading indicator
        $rootScope.$on('startLoadingProgress', function () {
            vm.loadingCustomProgress = true;
        });

        // De-activate loading indicator
        $rootScope.$on('endLoadingProgress', function () {
            $timeout(function () {
                vm.loadingCustomProgress = false;
            });
        });

        function showAlert() {
            var confirm = $mdDialog.confirm()
                .title('Stay Offline?')
                .textContent('Do you want us to remember that you want to stay offline?')
                .ariaLabel('')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm)
                .then(function () {
                    rememberStayOffline(true);
                }, function () {
                    rememberStayOffline(false);
                });
        };

        function rememberStayOffline(connected) {
            var farmManagerObj = localStorageFactory.getValue();
            farmManagerObj.rememberStayOffline = connected;
            localStorageFactory.setValue(farmManagerObj);

        };
    }

})();
