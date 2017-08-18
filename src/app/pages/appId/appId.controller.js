(function ()
{
  'use strict';

  angular
  .module('app.appId')
  .controller('appIdController', appIdController);

  /** @ngInject */
  function appIdController($scope, $mdToast, appFactory, loginFactory, $state, $location)
  {
    var model = this;
    model.showEnterSharedKey = false;
    model.showEnterKey = function () {
      model.showEnterSharedKey = true;
    }

    model.createNewKey = function () {
      appFactory.newKey().then(function (data) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Application created successfully')
        );
        $state.go('app.farmmanager');
      }).catch(function (error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent(error)
        );
      });
    }
    model.save = function () {
      appFactory.addKeyToUser(model.appKey).then(function (data) {
        $mdToast.show(
          $mdToast.simple().textContent('User associated to application')
        );
        $state.go('app.farmmanager');
      }).catch(function (error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent(error)
        );
      });
    }
    model.cancel = function () {
      model.showEnterSharedKey = false;
    }

    model.logout =function(){
      loginFactory.logout();
      $location.path('/login-v2');
    }
  }
})();
