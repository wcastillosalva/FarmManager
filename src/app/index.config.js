(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($translateProvider)
    {
        // Put your common app configurations here

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });

        var lang= localStorage.getItem('farmManagerLang');
        if(!lang)
          lang='en';
        $translateProvider.preferredLanguage(lang);
        $translateProvider.useSanitizeValueStrategy(null);
    }

})();
