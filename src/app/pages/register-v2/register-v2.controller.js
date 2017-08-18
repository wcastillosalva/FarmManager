(function () {
    'use strict';

    angular
        .module('app.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */
    function RegisterV2Controller($scope, $rootScope, loginFactory, $state, $mdToast) {
        var model = this;
        model.appVersion = $rootScope.appVersion;
        model.user = {};
        model.userfullname = '';
        model.email = '';
        model.password = '';
        model.repeatpassword = '';
        model.register = function () {
            if (model.form.password == model.form.passwordConfirm) {
                loginFactory.register(model.form.username, model.form.email, model.form.password).then(function (data) {
                    if (data == true)
                        $state.go('app.farmmanager');
                }).catch(function (data) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                    );
                });
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Passwords don't match")
                );
            }

        }
        model.cancel = function () {
            $state.go('app.register-v2');
        }
    }
})();
