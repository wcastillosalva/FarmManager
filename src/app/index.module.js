(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',


            'app.login-v2',
            'app.register-v2',
            'app.appId',
            'app.profile',
            // Sample
            'app.farmmanager'

        ]);
})();
