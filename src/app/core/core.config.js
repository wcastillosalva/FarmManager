(function () {
  'use strict';

  angular
  .module('app.core')
  .config(config);

  /** @ngInject */
  function config($ariaProvider, $logProvider, msScrollConfigProvider, fuseConfigProvider, $mdDateLocaleProvider) {
    // Enable debug logging
    $logProvider.debugEnabled(true);

    /*eslint-disable */

    // ng-aria configuration
    $ariaProvider.config({
      tabindex: false
    });

    // Fuse theme configurations
    fuseConfigProvider.config({
      'disableCustomScrollbars': false,
      'disableCustomScrollbarsOnMobile': true,
      'disableMdInkRippleOnMobile': true
    });

    // msScroll configuration
    msScrollConfigProvider.config({
      wheelPropagation: true
    });

    $mdDateLocaleProvider.formatDate = function (date) {
      return moment(date).format('YYYY-MM-DD');
    };

    /*eslint-enable */
  }
})();
