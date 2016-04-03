angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })
  .controller('DashboardController', function ($scope, $state) {
    $scope.dashboard = {swiper: false, slider: false, activeIndexView: 2};

    $scope.changeState = function () {
      console.log("search");
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
  .controller('ChatsCtrl', function ($scope, Chats, $ionicTabsDelegate) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});



    $scope.chats = Chats.all();


    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
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
  .controller('SearchCtrl', function($scope, $state) {
    //  TODO handle search

  })
  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
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



