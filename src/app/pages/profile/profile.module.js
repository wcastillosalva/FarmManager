(function () {
  'use strict';

  angular
  .module('app.profile', ['app.farmmanager'])
  .config(config);

  var app = angular.module('app.profile');

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.profile', {
      url: '/pages/profile',
      views: {
        'content@app': {
          templateUrl: 'app/pages/profile/profile.html',
          controller: 'ProfileController as vm'
        }
      },
      resolve: {
        appIntLoaded: function (loginFactory) {
          return loginFactory.checkUserAunthentication();
        }
      },
      bodyClass: 'profile'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/pages/profile');

    // Navigation
    msNavigationServiceProvider.saveItem('profile', {
      title: 'Profile',
      icon: 'icon-account',
      state: 'app.profile',
      weight: 6,
      translate: 'PROFILE.MENU',
    });
  }

})();
