angular.module('starter.services', ['ionic', 'LocalStorageModule'])
  .service('SearchService', function($q, $http) {
      var searchResult = [];
    return {
      search: doSearch,
      results: function(){
        return searchResult;
      },
      searchByParams:searchByParams
    }
    //return {
      function doSearch(data) {
        var hasNumber = /\d/;
        var numAddress = data.replace( /^\D+/g, '');
console.log("num: " + numAddress);
        var deferred = $q.defer();
        var promise = deferred.promise;
        var req = {
          method: 'GET',
          url: 'http://ec2-52-38-209-139.us-west-2.compute.amazonaws.com/api/search/searchAssetByAddress',
          //dataType: "json",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          params: {Street: data,
         Num_Address: numAddress }
        }


        $http(req).then(function(response){
            console.log("success  search" + JSON.stringify(response.data));
            if(response.data != "") {
              deferred.resolve('Welcome ' + name + '!');
              searchResult = [];
              searchResult.push(response.data);
          }else deferred.reject("Server problems");
          },
          function(response){
            deferred.reject('Wrong credentials.');
            console.log("Faild to search " + response.status + status + " data: " + req.data);

          });
        //if (name == 'user' && pw == 'secret') {
        //  deferred.resolve('Welcome ' + name + '!');
        //} else {
        //  deferred.reject('Wrong credentials.');
        //}
        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        }
        return promise;
      };

    function searchByParams(data){
      var checkboxdata = "";
      if(!data.includes("AirCon")){
        checkboxdata = "&AirCon=";
      }
      if(!data.includes("Elevator")){
        checkboxdata += "&Elevator=";
      }
      if(!data.includes("Mamad")){
        checkboxdata += "&Mamad=";
      }
      // neighborhood
      if (data.includes("%D7%91%D7%97%D7%A8+%D7%A9%D7%9B%D7%95%D7%A0%D7%94")){
        data = data.replace("%D7%91%D7%97%D7%A8+%D7%A9%D7%9B%D7%95%D7%A0%D7%94", "");
        console.log("data: "+ data.replace("%D7%91%D7%97%D7%A8+%D7%A9%D7%9B%D7%95%D7%A0%D7%94", ""));
      }
      // status
      if (data.includes("%D7%91%D7%97%D7%A8+%D7%A1%D7%98%D7%98%D7%95%D7%A1")){
        data = data.replace("%D7%91%D7%97%D7%A8+%D7%A1%D7%98%D7%98%D7%95%D7%A1", "");
      }
      //type
      if (data.includes("%D7%A1%D7%95%D7%92+%D7%A0%D7%9B%D7%A1")){
        data = data.replace("%D7%A1%D7%95%D7%92+%D7%A0%D7%9B%D7%A1", "");
      }
      var jsonData = JSON.parse('{"' + decodeURI(data+"&City=beer sheva").replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\s/g,'') + '"}');
      var deferred = $q.defer();
      var promise = deferred.promise;
      var req = {
        method: 'POST',
        url: 'http://ec2-52-38-209-139.us-west-2.compute.amazonaws.com/api/search/searchAssetsByParams',
        //dataType: "json",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data:  data+"&City="+checkboxdata
      }


      $http(req).then(function(response){
          console.log("success  search" + JSON.stringify(response.data));
          if(response.data != "") {
            deferred.resolve('Welcome ' + name + '!');
            searchResult = [];
            searchResult.push(response.data);
          }else deferred.reject("Server problems");
        },
        function(response){
          deferred.reject('Wrong credentials.');
          console.log("Faild to search " + response.status + status + " data: " + req.data);

        });
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
    function getUrlVars(url) {
      var hash;
      var myJson = {};
      var hashes = url.slice(url.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
      }
      return myJson;
    }
    //}
  })
  .factory('LoginService', function($q, $http) {
    var fav = [];
    return {
      getAssetsByAgent: getAssetsByAgent,
      favorites: function() {
        return fav;
      }

    }
       function getAssetsByAgent(name, token) {
        var deferred = $q.defer();
         console.log("asset token " + token)
        var promise = deferred.promise;
        var req = {
          method: 'GET',
          url: 'http://appchii-env.us-west-2.elasticbeanstalk.com/api/login/getAssetsByAgent',
          //dataType: "json",
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
       },
          params: {Username:name}
        };


        $http(req).then(function(response){
            console.log("success  search" + JSON.stringify(response.data));
              deferred.resolve('Welcome ' + name + '!');
              fav = [];
              fav.push(response.data);

              console.log("fav pushed" + fav);
          },
          function(response){
            deferred.reject('Wrong credentials.');
            console.log("Faild to search " + response.status + status + " data: " + req.data);

          });
        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        }
        return promise;
      }

  })

  .service('UploadAssetService', function($q, $http, localStorageService){
    return {
      uploadAsset: function (str) {
        var checkboxdata = "";
        if(!str.includes("AirCon")){
          checkboxdata = "&AirCon=";
        }
        if(!str.includes("Elevator")){
          checkboxdata += "&Elevator=";
        }
        if(!str.includes("Mamad")){
          checkboxdata += "&Mamad=";
        }
        var deferred = $q.defer();
        var promise = deferred.promise;
        var req = {
          method: 'POST',
          url: 'http://ec2-52-38-209-139.us-west-2.compute.amazonaws.com/api/asset/addAsset',
          //dataType: "json",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: str  + "&Agent=" + localStorageService.get("TUserName")+checkboxdata+"&City=smartut" + "&NumOfFloors=0"
        }


        $http(req).then(function () {
            deferred.resolve('Welcome ' + name + '!');
            console.log("success  login");
          },
          function (response) {
            deferred.reject('Wrong credentials.');
            console.log("Faild to login " + response.status + " data: ");

          });
        //if (name == 'user' && pw == 'secret') {
        //  deferred.resolve('Welcome ' + name + '!');
        //} else {
        //  deferred.reject('Wrong credentials.');
        //}
        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        }
        return promise;
      }
    }
  })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
