angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })
  .controller('DashboardController', function ($scope, $state, $ionicViewSwitcher) {
    $scope.dashboard = {swiper: false, slider: false, activeIndexView: 2};

    $scope.changeState = function () {
      console.log("search");
      //$ionicViewSwitcher.nextDirection('up');
      $state.go('search');
    };

    $scope.$watch('dashboard.slider', function (swiper) {
      if (swiper) {
        $scope.swiper = swiper;

        swiper.on('onSlideChangeStart', function (swiper) {
          if(!$scope.$$phase) {
            $scope.$apply(function () {
              $scope.dashboard.activeIndexView = swiper.snapIndex;
              //$scope.enterState()
              console.log("slide " +swiper.snapIndex);
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
  .controller('ChatsCtrl', function ($scope, Chats, $ionicModal,$ionicTabsDelegate) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $ionicModal.fromTemplateUrl('templates/new-contact-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      console.log("contact");
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.chats = Chats.all();


    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('ProfileCtrl', function($scope, $state, localStorageService) {
    $scope.openUpload = function () {
      console.log("upload");
      $state.go('upload');
    }
  })

  .controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, localStorageService) {
    $scope.data = {};

    if(localStorageService.get("isLoggedIn")){
      $state.go('dashboard');
    }

    $scope.login = function() {
      console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
      LoginService.loginUser($scope.data.username, $scope.data.password, localStorageService).success(function(data) {
        localStorageService.set("isLoggedIn", true);
        $state.go('dashboard');
      }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  })
  .controller('SearchCtrl', function($scope, $state, SearchService, $rootScope, $ionicPopup) {
    //  TODO handle search
    $scope.results =[];
      console.log("result before: " + SearchService.results());
      $scope.submitSearch = function() {
        var str = $("#form").serialize();
        console.log("submit: " + str.toString());
        SearchService.search(str).success(function(){
          console.log("Good!!!!");
            $rootScope.results = SearchService.results();
          $state.go('search-result');
        }).error(function(){
          var alertPop = $ionicPopup.alert({
            title: 'החיפוש נכשל',
            template: 'בעיית חיבור לשרת'
          })
          console.log("Very bad!!!!");
        });

        console.log("result after: " + JSON.stringify(SearchService.results()));
      }

  })
  .controller('SearchResultCtrl', function($scope, $state, SearchService, $rootScope) {
      $scope.results = $rootScope.results;
    //$scope.results=[{neighborhood: "some", type: "bil"}];
    console.log("results in scope: " + JSON.stringify($scope.results))
  })
  .controller('UploadCtrl', function($scope, $state) {
  //  TODO handle upload
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
      }    }
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

    $scope.closeTaskModal = function() {
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
  .controller(function($scope, $ionicActionSheet, $timeout) {

    // Triggered on a button click, or some other target
    $scope.show_sheet = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show_sheet({
        buttons: [
          { text: '<b>Share</b> This' },
          { text: 'Move' }
        ],
        destructiveText: 'Delete',
        titleText: 'Modify your album',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 2000);

    };
  });



