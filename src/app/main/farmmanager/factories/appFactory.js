(function () {
  'use strict';

  angular
  .module('app.farmmanager')
  .factory('appFactory', appFactory);

  /** @ngInject */
  function appFactory($q, $http, $rootScope, $state) {
    var appKey = '';
    return {
      addKeyToUser: _addKeyToUser,
      newKey: _newKey,
    }

    function _addKeyToUser(appKey) {
      var defer = $q.defer();
      var appKeyRef = firebase.database().ref('applications/' + appKey);
      appKeyRef.on('value', function (snapshot) {
        if (snapshot.exists()) {
          var user = {
            id: firebase.auth().currentUser.uid,
            appId: appKey
          }
          firebase.database().ref('users/' + firebase.auth().currentUser.uid).set(user).then(function (data) {
            defer.resolve(true);
          }).catch(function (error) {
            defer.reject(error);
          });
        } else {
          defer.reject('Please check your application key');
        }

      }, function (errorObject) {
        defer.reject(errorObject);
      });
      return defer.promise;
    };

    function _newKey() {
      var defer = $q.defer();
      var newApp = {
        appId: '',
        autoSendData: false
      }
      newApp.appId = firebase.database().ref().child('applications').push().key;
      var user = {
        id: firebase.auth().currentUser.uid,
        appId: newApp.appId
      }
      firebase.database().ref('applications/' + newApp.appId).set(newApp).then(function (data) {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).set(user).then(function (data) {
          defer.resolve(true);
        }).catch(function (error) {
          defer.reject(error);
        });
      }).catch(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
  }
}());
