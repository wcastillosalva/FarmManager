(function () {
    'use strict';

    angular
        .module('app.farmmanager')
        .factory('loginFactory', loginFactory);

    /** @ngInject */
    function loginFactory($q, $rootScope, $location, menuFactory, localStorageFactory) {
        var _auth = firebase.auth();
        var currentUser = null;
        return {
            authenticate: _authenticate,
            checkUserAunthentication: _checkUserAunthentication,
            logout: _logout,
            reauthenticate: _reauthenticate,
            register: _register,
            updateUser: _updateUser
        }

        /*Public methods*/
        function _authenticate(email, password, rememberme) {
            var defer = $q.defer();
            var farmManagerObj = localStorageFactory.getValue();
            _auth.signInWithEmailAndPassword(email, password).then(function (userInfo) {
                _getToken(userInfo).then(function (token) {
                    _getUserConf(userInfo.uid).then(function (userConf) {
                        currentUser = _getUserInfoObj(userInfo, userConf, token);
                        farmManagerObj.user = currentUser;
                        localStorageFactory.setValue(farmManagerObj);
                        defer.resolve(currentUser);
                    }).catch(function (error) {
                        currentUser = _getUserInfoObj(userInfo, null, token);
                        farmManagerObj.user = currentUser;
                        localStorageFactory.setValue(farmManagerObj);
                        defer.resolve(currentUser);
                    });
                }).catch(function (error) {
                    defer.reject(error);
                });
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _checkUserAunthentication(isAppId) {
            var farmManagerObj = localStorageFactory.getValue();
            var defer = $q.defer();
            if ($rootScope.user) {
                _refreshUserToken().then(function (data) {
                    //console.log('User token refreshed');
                }).catch(function (error) {
                    console.error(error);
                });
                menuFactory.buildMenu().then(function (data) {
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.resolve(false);
                });

            } else {
                _authenticateLocal().then(function (userInfo) {
                    $rootScope.user = userInfo;
                    if (!userInfo.appId && !(isAppId)) {
                        $location.path('/appId');
                    }
                    _refreshUserToken().then(function (data) {
                        //console.log('User token refreshed');
                    }).catch(function (error) {
                        console.error(error);
                    });
                    menuFactory.buildMenu().then(function (data) {
                        defer.resolve(true);
                    }).catch(function (error) {
                        defer.resolve(false);
                    });
                }).catch(function (error) {
                    $location.path('/login-v2');
                    defer.resolve(true);
                });
            }
            return defer.promise;
        };

        function _logout() {
            localStorageFactory.clearValue();
            _auth.signOut();
        };

        function _reauthenticate(password) {
            var defer = $q.defer();
            var user = _auth.currentUser;
            var credential = firebase.auth.EmailAuthProvider.credential(_auth.currentUser.email, password);
            user.reauthenticateWithCredential(credential).then(function () {
                defer.resolve(true);
            }, function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _register(userfullname, email, password) {
            var defer = $q.defer();
            _auth.createUserWithEmailAndPassword(email, password).then(function (firebaseUser) {
                _auth.currentUser.updateProfile({
                    displayName: userfullname
                }).then(function () {
                    console.log("Successfully created user account with uid:", firebaseUser.uid);
                    defer.resolve(true);
                }, function (error) {
                    console.error("Error: ", error);
                    defer.reject(error);
                });

            }).catch(function (error) {
                console.error("Error: ", error);
                defer.reject(error);
            });
            return defer.promise;
        };

        function _updateUser(user) {
            var defer = $q.defer();
            var farmManagerObj = localStorageFactory.getValue();
            var promises = [];
            if (user.email != _auth.currentUser.email) {
                promises.push(_auth.currentUser.updateEmail(user.email));
            }
            if (user.fullName != _auth.currentUser.displayName) {
                promises.push(_auth.currentUser.updateProfile({
                    displayName: user.fullName
                }));
            }
            if (user.autoSendData != $rootScope.user.autoSendData) {
                var updates = {};
                updates['/autoSendData/'] = user.autoSendData;
                promises.push(firebase.database().ref('users/' + _auth.currentUser.uid).update(updates));
            }
            if (user.newPassword != '') {
                promises.push(_auth.currentUser.updatePassword(user.newPassword));
            }
            if (promises.length > 0) {
                $q.all(promises).then(function (data) {
                    $rootScope.user.autoSendData = user.autoSendData;
                    farmManagerObj.user = $rootScope.user;
                    localStorageFactory.setValue(farmManagerObj);
                    defer.resolve(true);
                }).catch(function (error) {
                    defer.reject(error);
                });
            }
            return defer.promise;
        };

        /*End Public methods*/
        function _authenticateLocal() {
            var defer = $q.defer();
            var farmManagerObj = localStorageFactory.getValue();
            if (currentUser) {
                defer.resolve(currentUser);
            } else {
                var farmManagerStorageObjStr = localStorage.getItem('farmManagerStorageObj');
                if (farmManagerStorageObjStr) {
                    var farmManagerStorageObj = JSON.parse(farmManagerStorageObjStr);
                    currentUser = farmManagerStorageObj.user;
                    defer.resolve(currentUser);
                } else {
                    _auth.onAuthStateChanged(function (userInfo) {
                        if (userInfo) {
                            _getToken(userInfo).then(function (token) {
                                _getUserConf(userInfo.uid).then(function (userConf) {
                                    currentUser = _getUserInfoObj(userInfo, userConf, token);
                                    farmManagerObj.user = currentUser;
                                    localStorageFactory.setValue(farmManagerObj);
                                    defer.resolve(currentUser);
                                }).catch(function (error) {
                                    currentUser = _getUserInfoObj(userInfo, null, token);
                                    farmManagerObj.user = currentUser;
                                    localStorageFactory.setValue(farmManagerObj);
                                    defer.resolve(currentUser);
                                });
                            }).catch(function (error) {
                                defer.reject(error);
                            });
                        } else {
                            defer.reject('Unauthorized');
                        }
                    });
                }
            }
            return defer.promise;
        };

        function _getUserConf(uid) {
            var defer = $q.defer();
            var userRef = firebase.database().ref('users/' + uid);
            userRef.on('value', function (snapshot) {
                    if (snapshot.exists()) {
                        defer.resolve(snapshot.val());
                    } else {
                        defer.reject('This user is not configurated');
                    }
                },
                function (errorObject) {
                    defer.reject(errorObject);
                });
            return defer.promise;
        };

        function _getUserInfoObj(userInfo, userConf, token) {
            var user = {
                displayName: userInfo.displayName,
                email: userInfo.email,
                uid: userInfo.uid,
                appId: userConf ? userConf.appId : null,
                token: token,
                autoSendData: userConf ? userConf.autoSendData : false,
                proyect: userInfo.v.replace('.firebaseapp.com', '.firebaseio.com')
            };
            return user;
        };

        function _getToken(user) {
            var defer = $q.defer();
            user.getToken().then(function (token) {
                defer.resolve(token);
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        function _refreshUserToken() {
            var defer = $q.defer();
            var farmManagerObj = localStorageFactory.getValue();
            _auth.onAuthStateChanged(function (userInfo) {
                if (userInfo) {
                    _getToken(userInfo).then(function (currentToken) {
                        if (currentUser.token != currentToken) {
                            _auth.currentUser.getToken(true).then(function (newToken) {
                                currentUser.token = newToken;
                                $rootScope.user = currentUser;
                                farmManagerObj.user = currentUser;
                                localStorageFactory.setValue(farmManagerObj);
                            }).catch(function (error) {
                                defer.reject(false);
                            });
                        } else {
                            defer.resolve(true);
                        }
                    }).catch(function (error) {
                        defer.reject(false);
                    });
                } else {
                    defer.reject(false);
                }
            });
            return defer.promise;
        };


    };
})();
