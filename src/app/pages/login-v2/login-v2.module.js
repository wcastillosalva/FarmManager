(function ()
{
  'use strict';

  angular
  .module('app.login-v2', [])
  .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider)
  {
    // State
    $stateProvider.state('app.login-v2', {
      url      : '/login-v2',
      views    : {
        'main@'                          : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.login-v2': {
          templateUrl: 'app/pages/login-v2/login-v2.html',
          controller : 'LoginV2Controller as vm'
        }
      },
      bodyClass: 'login-v2'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/pages/login-v2');

  }

})();
