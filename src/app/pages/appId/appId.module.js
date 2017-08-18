(function ()
{
  'use strict';

  angular
  .module('app.appId',[])
  .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider)
  {
    // State
    $stateProvider.state('app.appId', {
      url      : '/appId',
      views    : {
        'main@'                        : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.appId': {
          templateUrl: 'app/pages/appId/appId.html',
          controller : 'appIdController as vm'
        }
      },
      resolve: {
        appIntLoaded: function (loginFactory) {
          return loginFactory.checkUserAunthentication(true);
        }
      },
      bodyClass: 'coming-soon'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/pages/appId');

  }

})();
