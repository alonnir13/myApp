/**
 * Created by Simon on 26/06/2016.
 */
angular.module('starter')

  .service('AuthService', function ($q, $http, localStorageService) {
    var LOCAL_TOKEN_KEY = 'mTokenKey';
    var username = '';
    var isAuthenticated = false;
    var authToken = '';

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      username = localStorageService.get('TUserName');
      if (token) {
        useCredentials(token);
        refreshToken();
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      //username = token.split('.')[0];
      isAuthenticated = true;
      authToken = token;
console.log("token " + token);
      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = token;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['Authorization'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function (name, pw) {
      var req = {
        method: 'POST',
        url: 'http://appchii-env.us-west-2.elasticbeanstalk.com/api/security/auth',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          username: name,
          password: pw
        }
      };
      return $http(req).then(function (response) {
        console.log("auth: " + response.data.token);
        storeUserCredentials(response.data.token);
        return response.data;
      }, function (response) {
        console.log("auth-faild: " + response.data);
        return response.data;
      });

    };

    var logout = function () {
      destroyUserCredentials();
    };

    function refreshToken(){
      var req = {
        method: 'GET',
        url: 'http://ec2-52-38-209-139.us-west-2.compute.amazonaws.com/api/security/refresh',
        //dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          username: username
        }
      };
      $http(req).then(function(response){
        console.log("refreshed: " + response.data.token);
        storeUserCredentials(JSON.stringify(response.data));
        return response.data;
      }, function(response){
        console.log("refreshed error: " + response.data);
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        storeUserCredentials(token);
        return response.data;

      });
    };

    loadUserCredentials();

    return {
      login: login,
      logout: logout,
      authToken: function(){
       return authToken;},
      isAuthenticated: function () {
        return isAuthenticated;
      },
      username: function () {
        return username;
      },
      refreshToken: refreshToken
    };
  })
