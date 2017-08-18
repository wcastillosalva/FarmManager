(function () {
  'use strict';

  angular
  .module('app.farmmanager')
  .factory('connectionFactory', connectionFactory);

  /** @ngInject */
  function connectionFactory($q, $http, $rootScope, $state, $mdToast, $filter) {
    return {
      checkOffline: _checkOffline,
    }

    function _checkOffline(redirect){
      if(!$rootScope.connected){
        var message = $filter('translate')('FARMMANAGER.FUNCTION_NOT_AVILABLE_OFFLINE');
        $mdToast.show({
          template : '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
          hideDelay: 7000,
          position : 'top right',
          parent   : '#content'
        });
        if(redirect)
          $state.go('app.farmmanager');
      }
      return $rootScope.connected;
    }
  };

}());
