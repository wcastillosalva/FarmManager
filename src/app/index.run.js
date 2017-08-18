(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $location, loginFactory, manageFactory, safeApply, $stateParams, localStorageFactory) {

        var supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {}

        document.addEventListener('touchstart', handleTouchMoveScroll, supportsPassive ? {
            passive: true
        } : false);

        document.addEventListener("ps-y-reach-end", scrollReachEnd, false);
        document.addEventListener("ps-scroll-up", scrollUp, false);

        function handleTouchMoveScroll() {
            if (document.getElementById('content').scrollTop + window.innerHeight > document.getElementById('content').scrollHeight) {
                scrollReachEnd();
            } else {
                scrollUp();
            }
        };

        function scrollUp() {
            safeApply($rootScope, function () {
                $rootScope.scrollEnd = false;
            });
        };

        function scrollReachEnd() {
            safeApply($rootScope, function () {
                $rootScope.scrollEnd = true;
            });
        };
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });

        $rootScope.refreshPendingDataMonitor = false;
        $rootScope.connected = false;

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                var farmManagerObj = localStorageFactory.getValue();
                if (farmManagerObj.rememberStayOffline) {
                    $timeout(function () {
                        firebase.database().goOffline();
                        $rootScope.connected = false;
                        $rootScope.$emit('connectionChangeEvent', []);
                    }, 2000);

                } else {
                    if (!$rootScope.connected) {
                        farmManagerObj.rememberStayOffline = null;
                        localStorageFactory.setValue(farmManagerObj);
                        $rootScope.connected = true;
                        $rootScope.$emit('connectionChangeEvent', []);
                    }
                }
            } else {
                if ($rootScope.connected) {
                    $rootScope.connected = false;
                    $rootScope.$emit('connectionChangeEvent', []);
                }
            }
        });


        $rootScope.useCustomSearch = false;

        $rootScope.$on('$stateChangeSuccess', function () {
            if ($state.current.name == 'app.farmmanager.manageListAnimals') {
                if (!$rootScope.useCustomSearch) {
                    $rootScope.useCustomSearch = true;
                    $rootScope.$emit('useCustomSearchChangeEvent', []);
                }
            } else {
                if ($rootScope.useCustomSearch) {
                    $rootScope.useCustomSearch = false;
                    $rootScope.$emit('useCustomSearchChangeEvent', []);
                }
            }

        });
        $rootScope.appVersion = 'v0.1.6 (2017-06-20)';

    }
})();
