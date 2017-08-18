(function ()
{
  'use strict';

  angular
  .module('app.register-v2', [])
  .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider)
  {
    // State
    $stateProvider.state('app.register-v2', {
      url      : '/register-v2',
      views    : {
        'main@'                          : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.register-v2': {
          templateUrl: 'app/pages/register-v2/register-v2.html',
          controller : 'RegisterV2Controller as vm'
        }
      },
      bodyClass: 'register-v2'
    });

    // Translate
    $translatePartialLoaderProvider.addPart('app/pages/register-v2');
  }

})();
