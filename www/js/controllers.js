var favStorage = "favorites";

angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })
  .controller('DashboardController', function ($scope, $rootScope, $ionicPopup, SearchService, $ionicPlatform, filterFilter, $state, $ionicViewSwitcher, $http) {
    $ionicPlatform.registerBackButtonAction(function () {
      if ($state.$current.name == "dashboard") {
        navigator.app.exitApp();
      } else $rootScope.$ionicGoBack();
    }, 100);
    $scope.show = true;
    $scope.streets = [];
    $scope.searchText = "";
    $scope.dashboard = {swiper: false, slider: false, activeIndexView: 2};
    $scope.model = "";
    $scope.searchBar = function () {
      $scope.searchText = $("#searchText").val();
      //$scope.searchText.push($("#searchText").val());
      //$scope.$apply();
      $scope.show = true;

    };
    $scope.getSt = function () {
      $http.get('img/BS_streets.txt')
        .then(function (res) {
          $scope.streets = res.data;
          console.log("json up ");
        });
      return $scope.streets;
    }
    $scope.chosesearch = function (text) {
      //$scope.searchText = text;
      console.log("street" + text);
      $("#searchText").val(text);
      $scope.searchText = text;
      $scope.show = false;
      document.getElementById('searchText').focus();
      window.cordova.plugins.Keyboard.show();
    }
    $scope.fastSearch = function () {
      if ($scope.searchText) {
        $scope.show = false;
        $scope.results = [];
        console.log("result before: " + SearchService.results());
        console.log("submit: " + $scope.searchText);
        SearchService.search($scope.searchText).success(function () {
          console.log("Good!!!!");
          $rootScope.results = [];
          $rootScope.results = SearchService.results();
          $state.go('search-result');
        }).error(function () {
          var alertPop = $ionicPopup.alert({
            title: 'החיפוש נכשל',
            template: 'אנא בדוק שהכתובת תקינה'
          })
          console.log("Very bad!!!!");
        });

        console.log("result after: " + JSON.stringify(SearchService.results()));

      }
      console.log($scope.searchText);
    }
    $scope.changeState = function () {
      console.log("search");
      //$ionicViewSwitcher.nextDirection('up');
      $state.go('search');
    };

    $scope.$watch('dashboard.slider', function (swiper) {
      if (swiper) {
        $scope.swiper = swiper;

        swiper.on('onSlideChangeStart', function (swiper) {
          if (!$scope.$$phase) {
            $scope.$apply(function () {
              $scope.dashboard.activeIndexView = swiper.snapIndex;
              //$scope.enterState()
              console.log("slide " + swiper.snapIndex);
            });
          } else {
            $scope.dashboard.activeIndexView = swiper.snapIndex;
          }
        });
      }
    });

    $scope.dashboard.slideTo = function (indexSlide) {
      $scope.swiper.slideTo(indexSlide);
    };
  })
  .controller('ChatsCtrl', function ($scope, $ionicPlatform, Chats, $ionicModal, $ionicPopup, $ionicTabsDelegate, localStorageService, $location) {
    $ionicPlatform.registerBackButtonAction(function () {
      navigator.app.exitApp();
    });
    var contactData = "contactStorage";
    $scope.phone = function (path) {
      console.log("path: " + path);
      //$location.url('tel:'+path);
      window.location.href = 'tel:' + path;
    };
    $scope.contacts = [];

    $scope.contact = {};

    $ionicModal.fromTemplateUrl('templates/new-contact-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.newContactModal = modal;
    });
    $scope.getContacts = function () {
      //fetches contact from local storage
      if (localStorageService.get(contactData)) {
        $scope.contacts = localStorageService.get(contactData);
      } else {
        $scope.contacts = [];
      }
    }
    $scope.createContact = function () {
      if ($scope.contact.name != null && $scope.contact.phone > 0) {
        //creates a new contact
        $scope.contacts.push($scope.contact);
        localStorageService.set(contactData, $scope.contacts);
        $scope.contact = {};
        //close new contact modal
        $scope.newContactModal.hide();
      } else {
        var alertPop = $ionicPopup.alert({
          title: 'תקלה',
          template: 'אחד השדות חסר'
        });
      }
    }
    $scope.removeContact = function (index) {
      //removes a contact
      $scope.contacts.splice(index, 1);
      localStorageService.set(contactData, $scope.contacts);
    }

    $scope.closeContactModal = function () {
      $scope.newContactModal.hide();
    }
    $scope.completeContact = function (index) {
      //updates a contact as completed
      if (index !== -1) {
        $scope.contacts[index].completed = true;
      }

      localStorageService.set(contactData, $scope.contacts);
    }
    $scope.openContactModal = function () {
      $scope.newContactModal.show();
    }

    $scope.chats = Chats.all();


    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('ProfileCtrl', function ($scope, $state, $rootScope, localStorageService) {

    $scope.getFav = function () {
      console.log("profile init");
      $scope.favor = localStorageService.get(favStorage);
    }

    $scope.openUpload = function () {
      console.log("upload");
      $state.go('upload');
    };
    $scope.goToAssetPage = function () {
      console.log("asset");
      $state.go('asset');
    }
  })


  .controller('assetCtrl', function ($scope, $rootScope, $state, $ionicModal, localStorageService, $stateParams) {
    var clientStorage = "clientStorage.";
    var contactData = "contactStorage";
    //var interClient = "interestedStorage";
    var assetId = $stateParams.assetid;
    $scope.asset = getAsset(assetId);
    $scope.clients = getInterested(assetId);
    var totalClients = [];
    var client = {};
    $scope.contacts = localStorageService.get(contactData);
    function getAsset(id) {
      var data = localStorageService.get(favStorage);
      for (var i = 0; i < data.length; i++) {
        if (data[i].assetid === parseInt(id)) {
          return data[i];
        }
      }
      console.log("searchctl: " + $rootScope.results[0]);
      var res = $rootScope.results[0];
      for (i = 0; i < res.length; i++) {
        if (res[i].assetid === parseInt(id)) {
          return res[i];
        }
      }
    }
    $scope.phone = function (path) {
      console.log("path: " + path);
      //$location.url('tel:'+path);
      window.location.href = 'tel:' + path;
    };
    function getInterested(id){
      totalClients = localStorageService.get(clientStorage + id);
      if(totalClients){
      return totalClients;
      }else {
        return totalClients = [];
      }
    }
    $ionicModal.fromTemplateUrl('templates/add-interested-client-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.clientModal = modal;
    });

    //$scope.getClients = function () {
    //  if (localStorageService.get(clientStorage)) {
    //    $scope.clients = localStorageService.get(clientStorage);
    //  } else {
    //    $scope.clients = [];
    //  }
    //}
    $scope.closeClientModal = function () {
      $scope.clientModal.hide();
    }
    $scope.openClientModal = function () {
      $scope.clientModal.show();
    }

    $scope.createClient = function () {
      var p =[];
      var clientString = JSON.stringify($scope.clients);
      for (var i = 0; i < $scope.contacts.length; i++) {
          var item = $scope.contacts[i];
          if (item.checked && !clientString.includes(item.phone)) {
            p.push(item)
            $scope.clients.push(item);

          }
      }
      totalClients = p;
        console.log("P: " +JSON.stringify(p));
        console.log("P has: " +JSON.stringify(p).includes("42242"));
      //$scope.clients.push(JSON.stringify(p));
      localStorageService.set(clientStorage+assetId, $scope.clients);
      //$scope.client = {};
      ////close new contact modal
      $scope.clientModal.hide();
    }
    $scope.removeClient = function(index){
      $scope.clients.splice(index, 1);
      localStorageService.set(clientStorage+assetId, $scope.clients);
    }
  })

  .controller('UploadCtrl', function ($scope, UploadAssetService, $ionicPopup, $state) {
    $scope.checkbox = {};
    $scope.uploadAsset = function () {
      var str = $("#upform").serialize();
      console.log("submit: " + str.toString() + "   " + $scope.checkbox.aircon);

      UploadAssetService.uploadAsset(str.toString()).success(function () {
        var alertPop = $ionicPopup.alert({
          title: 'החיפוש צלח',
          template: 'אחלה'
        })
        console.log("Very good!!!!");
      }).error(function () {
        var alertPop = $ionicPopup.alert({
          title: 'החיפוש נכשל',
          template: 'בעיית חיבור לשרת'
        })
        console.log("Very bad!!!!");
      });
    }
  })
  .controller('LoginCtrl', function ($scope, LoginService, AuthService, $http, $ionicPopup, $state, localStorageService, $rootScope) {
    $scope.data = {};
    $scope.fav = [];
    //if (localStorageService.get("isLoggedIn")) {
    //  $state.go('dashboard');
    //}
    console.log("log before: " + LoginService.favorites());
    $scope.login = function () {
      console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
      AuthService.login($scope.data.username, $scope.data.password).then(function (data) {
        $http.defaults.headers.common.Authorization = AuthService.authToken;
        localStorageService.set("TUserName", $scope.data.username);
        localStorageService.set("TPass", $scope.data.password);
        LoginService.getAssetsByAgent($scope.data.username, AuthService.authToken()).then(function(){
        $rootScope.fav = [];
        $rootScope.fav = LoginService.favorites();
        localStorageService.set(favStorage, $rootScope.fav[0]);
        localStorageService.set("isLoggedIn", true);
        console.log("log after: " + $rootScope.fav);
        $state.go('dashboard');}, function(){
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        })
      }, function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!' + data
        });
      });
    }
  })
  .controller('SearchCtrl', function ($scope, $state, SearchService, $rootScope, $ionicPopup) {
    $scope.results = [];
    console.log("result before: " + SearchService.results());
    $scope.submitSearch = function () {
      var str = $("#form").serialize();
      console.log("submit: " + str.toString());
      SearchService.search(str).success(function () {
        console.log("Good!!!!");
        $rootScope.results = [];
        $rootScope.results = SearchService.results();
        $state.go('search-result');
      }).error(function () {
        var alertPop = $ionicPopup.alert({
          title: 'החיפוש נכשל',
          template: 'בעיית חיבור לשרת'
        })
        console.log("Very bad!!!!");
      });

      console.log("result after: " + JSON.stringify(SearchService.results()));
    }

  })
  .controller('SearchResultCtrl', function ($scope, $state, SearchService, $rootScope) {
    $scope.results = $rootScope.results[0];
    //$scope.results=[{neighborhood: "some", type: "bil"}];
    console.log("results in scope: " + JSON.stringify($scope.results))
  })

  .controller('AccountCtrl', function ($scope, $ionicModal, localStorageService) {
    var taskData = "taskStorage";
    //initialize the tasks scope with empty array
    $scope.tasks = [];

//initialize the task scope with empty object
    $scope.task = {};

    //configure the ionic modal before use
    $ionicModal.fromTemplateUrl('templates/new-task-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.newTaskModal = modal;
    });
    $scope.getTasks = function () {
      //fetches task from local storage
      if (localStorageService.get(taskData)) {
        $scope.tasks = localStorageService.get(taskData);
      } else {
        $scope.tasks = [];
      }
    }
    $scope.createTask = function () {
      //creates a new task
      $scope.tasks.push($scope.task);
      localStorageService.set(taskData, $scope.tasks);
      $scope.task = {};
      //close new task modal
      $scope.newTaskModal.hide();
    }
    $scope.removeTask = function (index) {
      //removes a task
      $scope.tasks.splice(index, 1);
      localStorageService.set(taskData, $scope.tasks);
    }

    $scope.closeTaskModal = function () {
      $scope.newTaskModal.hide();
    }
    $scope.completeTask = function (index) {
      //updates a task as completed
      if (index !== -1) {
        $scope.tasks[index].completed = true;
      }

      localStorageService.set(taskData, $scope.tasks);
    }
    $scope.openTaskModal = function () {
      console.log("account");
      $scope.newTaskModal.show();
    }
  });


// shit
angular.module('mySuperApp', ['ionic'])
  .controller(function ($scope, $ionicActionSheet, $timeout) {

    // Triggered on a button click, or some other target
    $scope.show_sheet = function () {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show_sheet({
        buttons: [
          {text: '<b>Share</b> This'},
          {text: 'Move'}
        ],
        destructiveText: 'Delete',
        titleText: 'Modify your album',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 2000);

    };
  });



