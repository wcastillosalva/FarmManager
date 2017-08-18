(function () {
    'use strict';

    angular
        .module('app.login-v2')
        .controller('LoginV2Controller', LoginV2Controller);

    /** @ngInject */
    function LoginV2Controller($scope, $rootScope, loginFactory, $state, $mdToast,$translate, localStorageFactory) {
        var model = this;
        model.appVersion = $rootScope.appVersion;
        model.user = {};
        model.username = '';
        model.password = '';
        model.rememberme = false;

        var farmManagerObj = localStorageFactory.getValue();
        model.langCode=farmManagerObj.lang;
        model.login = function () {
            loginFactory.authenticate(model.form.email, model.form.password, model.form.rememberme).then(function (userInfo) {
                $rootScope.user = userInfo;
                if (userInfo.appId)
                    $state.go('app.farmmanager');
                else
                    $state.go('app.appId');
            }).catch(function (data) {
                //ngNotify.set(data.message, 'error');
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.message)
                );
            });
        }
        model.register = function () {
            $state.go('register');
        }

        model.switchLang=function(){
          if(model.langCode=='en'){
            model.langCode='es';
          }
          else{
            model.langCode='en';
           }
           farmManagerObj.lang=model.langCode;
           localStorageFactory.setValue(farmManagerObj);

           $translate.use(model.langCode);
        }
    }
})();
