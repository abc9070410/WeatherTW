// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    
    if (window.cordova)
    {
        console.log("Device Ready");
        //setExtra();
        //requestNewRainfall();
        
        if (!gbExtraChecked)
        {
            console.log("Not check extra yet..");
        }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    cache: false,
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.new', {
    cache: false,
    url: '/new',
    views: {
      'tab-new': {
        templateUrl: 'templates/tab-new.html',
        controller: 'NewCtrl'
      }
    }
  })
  
  .state('tab.new-past', {
    cache: false,
    url: '/new/past',
    views: {
      'tab-new': {
        templateUrl: 'templates/tab-new-past.html',
        controller: 'NewPastCtrl'
      }
    }
  })
  
  .state('tab.new-future', {
    cache: false,
    url: '/new/future',
    views: {
      'tab-new': {
        templateUrl: 'templates/tab-new-future.html',
        controller: 'NewFutureCtrl'
      }
    }
  })

  .state('tab.search', {
      cache: false,
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
  .state('tab.search-detail', {
      cache: false,
      url: '/search/:chatId',
      views: {
        'tab-search': {
          templateUrl: 'templates/search-detail.html',
          controller: 'SearchDetailCtrl'
        }
      }
    })

  .state('tab.mark', {
      cache: false,
      url: '/mark',
      views: {
        'tab-mark': {
          templateUrl: 'templates/tab-mark.html',
          controller: 'MarkCtrl'
        }
      }
    })
	
  .state('tab.option', {
    cache: false,
    url: '/option',
    views: {
      'tab-option': {
        templateUrl: 'templates/tab-option.html',
        controller: 'OptionCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/new');

});
