(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .factory('localStorageFactory', localStorageFactory);

    /** @ngInject */
    function localStorageFactory() {
        return {
            getValue: _getValue,
            setValue: _setValue,
            clearValue: _clearValue,
            getViewType: _getViewType,
            setViewType: _setViewType,
        }

        function _clearValue() {
            localStorage.removeItem('farmManagerObj');
        };

        var _farmManagerObj;

        function _getViewType() {
            return _getValue().viewType;
        }

        function _setViewType(cards) {
            _farmManagerObj = _getValue();
            if (cards) {
                _farmManagerObj.viewType = 'cards'
            } else {
                _farmManagerObj.viewType = 'grid'
            }
            _setValue(_farmManagerObj);
        }

        function _getValue() {
            if (!_farmManagerObj) {
                var _farmManagerStr = localStorage.getItem('farmManagerObj');
                if (_farmManagerStr) {
                    _farmManagerObj = JSON.parse(_farmManagerStr);
                } else {
                    _farmManagerObj = _getNewObj();
                }
            }
            return _farmManagerObj;
        };

        function _getNewObj() {
            return {
                lang: 'en',
                shortcuts: [],
                viewType: 'cards',
                user: {
                    displayName: '',
                    email: '',
                    uid: '',
                    appId: '',
                    token: '',
                    autoSendData: false,
                    proyect: ''
                },
                rememberStayOffline: null
            };
        };

        function _setValue(farmManagerObj) {
            _farmManagerObj = farmManagerObj;
            localStorage.setItem('farmManagerObj', JSON.stringify(farmManagerObj));
        };
    }
}());
