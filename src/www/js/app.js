// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.option', {
    url: '/option',
    views: {
      'menuContent': {
        templateUrl: 'templates/option.html'
      }
    }
  })

  .state('app.info', {
      url: '/info',
      views: {
        'menuContent': {
          templateUrl: 'templates/info.html',
          controller: 'InfoCtrl'
        }
      }
    })
    
  .state('app.info-past', {
    cache: false,
    url: '/info/past',
    views: {
      'menuContent': {
        templateUrl: 'templates/info-past.html',
        controller: 'InfoPastCtrl'
      }
    }
  })
  
  .state('app.info-future', {
    cache: false,
    url: '/info/future',
    views: {
      'menuContent': {
        templateUrl: 'templates/info-future.html',
        controller: 'InfoFutureCtrl'
      }
    }
  })
  
  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        templateUrl: 'templates/history.html',
        controller: 'HistoryCtrl'
      }
    }
  })
  
  .state('app.favourite', {
    url: '/favourite',
    views: {
      'menuContent': {
        templateUrl: 'templates/favourite.html',
        controller: 'FavouriteCtrl'
      }
    }
  })
    
    

  .state('app.single', {
    url: '/favourite/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/info');
});
