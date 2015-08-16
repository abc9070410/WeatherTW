angular.module('starter.controllers', [])

.controller('NewCtrl', function($scope, $state, $ionicLoading, $ionicPlatform) {
    
    
    $scope.loadStart = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }
    $scope.loadDone = function() {
        $ionicLoading.hide();
    }
    $scope.clickUpdate = function() {
        
        // for test
        buildRainfallData();
        $scope.chat = getRailfallData(GOV_DATA[2][2])[0];
        $scope.text = "test done";
        $state.go($state.current, {}, {}); // page update
    };
    $scope.findRainfall = function() {
        if ((this.readyState == 3 || this.readyState == 4) && 
            this.responseText.indexOf("\"spotlight\"") > 0)
        {
            parseGPS(this.responseText);
            
            $scope.currentLocationGPS = gasTargetGPS;
            
            var i = getNearLocationIndex(GOV_DATA, gasTargetGPS[0], gasTargetGPS[1]);
            
            $scope.rainPastStationGPS = gasStationGPS;
            $scope.rainPastStationDistance = gsDistance + " km";
    
            console.log("GET:" + GOV_DATA[i]);
            
            $scope.rainPastStationName = GOV_DATA[i][0] + "," + GOV_DATA[i][1] + GOV_DATA[i][2];
            $scope.chat = getRailfallData(GOV_DATA[i][2])[0]; // search by ID
            
            if (!$scope.chat) // TO DO : Why the ID cannot be found if the ID is the second location ? ex. 海山漁港 (O1D58)
            {
                $scope.chat = getRailfallData(GOV_DATA[i][0])[0]; // search by name
            }
            
            $scope.rainPastRecord = $scope.chat.description;
            $scope.rainPastIcon = $scope.chat.icon;
            
            
            
            i = getNearLocationIndex(GOV_DATA2, gasTargetGPS[0], gasTargetGPS[1]);
            
            $scope.rainFutureStationGPS = gasStationGPS;
            $scope.rainFutureStationDistance = gsDistance + " km";
    
            console.log("GET:" + GOV_DATA2[i]);
            
            $scope.rainFutureStationName = GOV_DATA2[i][0] + "," + GOV_DATA2[i][2];
            
            var jsUrl = "http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/" + GOV_DATA2[i][2] + "_3Hr.js";
            
            addJS(jsUrl, $scope.addJSDone);
            
            
        }
    }
    
    //$scope.clickSearch = fSearchLocation;
    $scope.clickSearch = function() {
    }
    
    $scope.addJSDone = function() {
        console.log("add JS done : " + MyLabel);
        
        $scope.rainFutureStationRecord = MyLabel;
        
        $scope.loadDone();
        //window.location.reload(true);
        $state.go($state.current, {}, {}); // page update
    }
    
    $scope.init = function() {
        if (window.cordova)
        {
            $scope.loadStart();
            requestNewRainfall($scope.requestRailfallDone);
        }
        
        var jsTown = "http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/6801100_3Hr.js";
        
        //addJS(jsTown, $scope.addJSDone);
    }
    
    $scope.requestRailfallDone = function() {
        if (this.readyState == 4) 
        {
            parseRainfall(this.responseText);
            
            $scope.checkExtra();
        }
    }
    
    $scope.checkExtra = function() {
        console.log("checkExtra : " + gbPlatformReady + "," + gbExtraChecked);
        
        if (!gbPlatformReady || gbExtraChecked)
        {
            return;
        }
        
        setExtra(function(sExtra) {
            console.log("Exist Extra: " + sExtra);
            
            gbExtraChecked = true;
            
            $scope.currentLocationName = sExtra.trim().split("http:")[0];
            
            requestGPS(sExtra, $scope.findRainfall);
        },
        function() {
            console.log("no Extra");
            $scope.loadDone();
        });
    }
    
    $ionicPlatform.ready(function() {
        gbPlatformReady = true;
        
        console.log("Platform Ready");
        
        $scope.checkExtra();
    });
    
    $scope.$on('$ionicView.enter', function(e) {
        console.log("Enter NewCtrl");
        
        $scope.init();
    });
})

.controller('SearchCtrl', function($scope, $state, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.prevInputKeyword = "";

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  
  $scope.clickUpdate = fClickUpdate;
  $scope.onSearchChange = function(inputKeyword) {
      console.log("onSearchChange: " + inputKeyword);
      
      if (inputKeyword.length < 2)
      {
          return;
      }
      
      $scope.chats = getRailfallData(inputKeyword);
      $scope.prevInputKeyword = inputKeyword;
      
      $state.go($state.current, {}, {}); // page update
  }
})

.controller('MarkCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('SearchDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('OptionCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

/*
chrome://inspect/#devices

ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
ionic plugin add https://github.com/Initsogar/cordova-webintent.git

http://www.cwb.gov.tw/V7/js/select_town.js
http://www.cwb.gov.tw/V7/forecast/town368/24GTPast/plot/6801100_24Past.js
http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/6801100_3Hr.js
http://www.cwb.gov.tw/V7/forecast/town368/7Day/plot/6801100_7Day.js

http://www.cwb.gov.tw/V7/forecast/town368/24GTPast/6801300.htm


// Libary Search :

竹北文化中心
關鍵字: KEYWORD
http://203.71.213.35/toread/refineSearch.svc?base_url=%2Ftoread%2F&location=0&pn=opac%2FSearch&q=KEYWORD&view=LIST
http://203.71.213.35/toread/opac/bibliographic_view/270570?location=0&q=KEYWORD&start=0&view=LIST

新竹市圖書館
http://webpac.hcml.gov.tw/webpac/booksearch.do?searchtype=simplesearch&search_field=TI&search_input=KEYWORD

1. 阿祖說媽媽辦了很多支手機，很多帳單寄過來
2. 功德會可以幫忙出轉移房子的錢，但基金會的律師說需要媽媽本人到場
3. 券益每個月一千九還沒有轉到阿祖這邊，還有怕媽媽結婚，導致這個一千九領不到

*/




