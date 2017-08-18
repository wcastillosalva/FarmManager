(function () {
    'use strict';

    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope, $rootScope, msNavigationService, adminFactory, safeApply) {
        var vm = this;
        vm.appVersion = $rootScope.appVersion;
        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        //////////

        /**
         * Toggle folded status
         */
        function toggleMsNavigationFolded() {
            vm.folded = !vm.folded;
        }

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function () {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });

        /*adminFactory.getFarms().then(function(farms){
          var i=1;
          angular.forEach(farms, function (value, key) {
            msNavigationService.saveItem('fuse.farmmanager.manageListFarms.'+ value.id, {
              title: value.name,
              icon: 'icon-home',
              state: 'app.farmmanager.manageFarm',
              stateParams: {
                'farm': value,
                'id': value.id
              },
              translate: value.name,
              weight: i
            });
            i++;
          });
          safeApply($scope, function(){});
        }).catch(function(error){

        });*/
    }

})();
