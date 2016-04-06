angular.module('starter.services', ['ionic', 'LocalStorageModule'])

  .service('LoginService', function($q, $http) {
    return {
      loginUser: function(name, pw, localStorageService) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var req = {
          method: 'POST',
          url: 'http://ec2-52-36-182-79.us-west-2.compute.amazonaws.com/login/validate_User',
          //dataType: "json",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: "username=lirond101&password=rnadal101"
        }


        $http(req).then(function(){
          deferred.resolve('Welcome ' + name + '!');
        console.log("success  login");
        },
          function(){
            deferred.reject('Wrong credentials.');
            console.log("Faild to login " + status + " data: " + data);

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
