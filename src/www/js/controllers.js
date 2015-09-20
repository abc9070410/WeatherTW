angular.module('starter.controllers', [])


.controller('InfoCtrl', function(
  $rootScope, $scope, $state, $ionicLoading, $ionicPlatform, $ionicPopup, $ionicSideMenuDelegate) {
    
    $scope.pastDataArray = [];
    $scope.futureDataArray = [];
    
    $scope.snapshotUrl = null;
    $scope.needAddHistory = false;
    
    $scope.locationLoaded = false;
    $scope.rainPastLoaded = false;
    $scope.rainPastLoaded2 = false;
    $scope.rainFutureLoaded = false;
    $scope.rainFutureLoaded2 = false;

    $scope.toggleLeft = function() {
      console.log("toggleLeft");
      $ionicSideMenuDelegate.toggleLeft();
    };
    
    $scope.clearFlag = function() {
      $scope.locationLoaded = false;
      $scope.rainPastLoaded = false;
      $scope.rainPastLoaded2 = false;
      $scope.rainFutureLoaded = false;
      $scope.rainFutureLoaded2 = false;
    }
    
    $scope.initFlag = function() {
        $scope.clearFlag();
        
        //$scope.rainPastLoaded2 = true;
        
        if (gsCurrentLocationName != null)
        {
            $scope.currentLocationGPS = gasTargetGPS;
            $scope.currentLocationName = gsCurrentLocationName;
            $scope.snapshotUrl = gsSnapshotUrl;
            $scope.locationLoaded = true;
            
            console.log("LocationName:" + $scope.currentLocationName);
        }
        
        console.log("PastData:" + gaPastDataArray.length);

        if (gaPastDataArray.length > 1)
        {
            $scope.set24HrStation();
            $scope.makePastData();
        }
        
        console.log("FutureData:" + gaFutureDataArray.length);
        if (gaFutureDataArray.length > 1)
        {
            $scope.setFutureStation();
            $scope.makeFutureData();
        }
        
    }
    
    $scope.isAllDone = function() {
        return $scope.locationLoaded &&
                //$scope.rainPastLoaded &&
                $scope.rainPastLoaded2 &&
                //$scope.rainFutureLoaded &&
                $scope.rainFutureLoaded2;
    }
    
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
    $scope.goGoogleMap = function() {
      var sUrl = "https://www.google.com.tw/maps/place/" + encodeURIComponent($scope.currentLocationName);
      window.open( sUrl, "_system" );
    }
    $scope.clickUpdate = function() {
        console.log("clickUpdate");
        /*
        // for test
        buildRainfallData();
        $scope.chat = paserRainfallData(GOV_DATA[2][2])[0];
        $scope.text = "test done";
        $scope.updatePage();
        */
        if ($scope.currentLocationName)
        {
            console.log("clickUpdate:" + $scope.currentLocationName);
            $scope.clearFlag();
            
            var sKeyword = gsExtra ? gsExtra : $scope.currentLocationName;
            requestGPS(sKeyword, $scope.findRainfall);
        }
        else
        {
          console.log("No location name");
        }
    };
    $scope.findRainfall = function() {
        if (this.readyState == 4 || 
            (this.readyState == 3 && 
             this.responseText.indexOf("\"spotlight\"") > 0 &&
             this.responseText.indexOf("//geo0.ggpht.com/cbk") > 0))
        {
            parseGPS(this.responseText);
            
            $scope.currentLocationName = gsCurrentLocationName;
            $scope.currentLocationGPS = gasTargetGPS;
            $scope.snapshotUrl = gsSnapshotUrl;
            $scope.locationLoaded = true;
            $scope.updatePage();
            
            if ($scope.needAddHistory)
            {
              addHistory(gsCurrentLocationName, gasTargetGPS, gsSnapshotUrl);
              $scope.needAddHistory = false;
            }
            
            //return;
            
            /* // 10 min rainfall information
            var i = getNearLocationIndex(GOV_DATA, gasTargetGPS[0], gasTargetGPS[1]);
            
            $scope.rainPastStationGPS = gasStationGPS;
            $scope.rainPastStationDistance = gsDistance + " km";
    
            console.log("GET:" + GOV_DATA[i]);
            
            $scope.rainPastStationName = GOV_DATA[i][0] + "," + GOV_DATA[i][1] + GOV_DATA[i][2];

            paserRainfallData(GOV_DATA[i][2]); // search by ID
            if (!gsRainPastRecord) // TO DO : Why the ID cannot be found if the ID is the second location ? ex. 海山漁港 (O1D58)
            {
                paserRainfallData(GOV_DATA[i][0]); // search by name
            }
            
            $scope.setPastData1();
            $scope.updatePage();
            */
            
            $scope.set24HrStation();

            sendHttpRequest($scope.past24HrRainUrl, $scope.pastRainDone);

            $scope.setFutureStation();
            /*
            var jsUrl = "http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/" + GOV_DATA2[i][2] + "_3Hr.js";
            
            addJS(jsUrl, $scope.addJSDone);
            */
            
            sendHttpRequest($scope.futurueRainUrl, $scope.futureRainDone);
            
            
        }
    }
    $scope.setFutureStation = function() {
        var i = getNearLocationIndex(GOV_DATA2, gasTargetGPS[0], gasTargetGPS[1]);

        $scope.rainFutureStationGPS = gasStationGPS;
        $scope.rainFutureStationDistance = gsDistance + " km";
        $scope.rainFutureStationName = GOV_DATA2[i][0] + "," + GOV_DATA2[i][2];

        console.log("GET:" + GOV_DATA2[i]);
        
        $scope.futurueRainUrl = "http://www.cwb.gov.tw/V7/forecast/town368/3Hr/" + GOV_DATA2[i][2] + ".htm";
    }
    $scope.set24HrStation = function() {
        var i = getNearLocationIndex(PAST_24HR_STATION, gasTargetGPS[0], gasTargetGPS[1]);
        $scope.past24HrStationName = PAST_24HR_STATION[i][1] + "," + PAST_24HR_STATION[i][2];
        $scope.past24HrStationGPS = gasStationGPS;
        $scope.past24HrStationDistance = gsDistance + " km";
        
        console.log("past 24hr GET:" + PAST_24HR_STATION[i]);
        
        $scope.past24HrRainUrl = "http://www.cwb.gov.tw/V7/observe/24real/Data/" + PAST_24HR_STATION[i][2] + ".htm";
    }

    $scope.setPastData1 = function() {
        $scope.rainPastRecord = gsRainPastRecord
        $scope.rainPastIcon = gsRainPastIcon;
        $scope.rainPastLoaded = true;
    }
    
    $scope.pastRainDone = function() {
        if (this.readyState == 4)
        {
            var aasPastRainData = parseTownPastRain(this.responseText);
            
            $scope.rainPastTime = aasPastRainData[0];
            $scope.rainPastTemperature = aasPastRainData[1];
            $scope.rainPastState = aasPastRainData[2];
            $scope.rainPastWindDirection = aasPastRainData[3];
            $scope.rainPastWindLevel = aasPastRainData[4];
            $scope.rainPastRelative = aasPastRainData[5];
            $scope.rainPastRainfall = aasPastRainData[6];
            
            $scope.makePastData();
            $scope.updatePage();
            
        }
    }
    
    $scope.makePastData = function() {
        
        for (var i = 0; $scope.rainPastTime && i < $scope.rainPastTime.length; i ++)
        {
            gaPastDataArray[i+1] = {
                rainPastTime: $scope.rainPastTime[i].replace("_", "   "),
                rainPastTemperature: $scope.rainPastTemperature[i],
                rainPastState: $scope.rainPastState[i],
                rainPastRelative: $scope.rainPastRelative[i],
                rainPastRainfall: $scope.rainPastRainfall[i]
            };
        }
        
        console.log("makePastData:" + gaPastDataArray.length);
        
        $scope.pastDataArray = gaPastDataArray;
        $scope.rainPastLoaded2 = true;
    }
    
    $scope.futureRainDone = function() {
        if (this.readyState == 4)
        {
            var aasFutureRainData = parseTownFutureRain(this.responseText);
            
            $scope.rainFutureDate = aasFutureRainData[0];
            $scope.rainFutureTime = aasFutureRainData[1];
            $scope.rainFutureState = aasFutureRainData[2];
            $scope.rainFutureTemperature = aasFutureRainData[3];
            $scope.rainFutureWindLevel = aasFutureRainData[4];
            $scope.rainFutureWindDirection = aasFutureRainData[5];
            $scope.rainFutureRelative = aasFutureRainData[6];
            $scope.rainFutureRate = aasFutureRainData[7];
            $scope.rainFutureFeel = aasFutureRainData[8];
            
            $scope.makeFutureData();
            $scope.updatePage();
            
        }
    }
    
    $scope.makeFutureData = function() {
        
      for (var i = 0; $scope.rainFutureTime && i < $scope.rainFutureTime.length; i ++)
      {
          var sTime = $scope.rainFutureDate[i] + "　　" + $scope.rainFutureTime[i];
          var sIcon = "http://www.cwb.gov.tw" + $scope.rainFutureState[i].split("_")[0];
          gaFutureDataArray[i+1] = {
              rainFutureTime: sTime.replace("_", "　　"),
              rainFutureTemperature: $scope.rainFutureTemperature[i],
              rainFutureExistIcon: true,
              rainFutureState: sIcon,
              rainFutureRelative: $scope.rainFutureRelative[i],
              rainFutureRate: $scope.rainFutureRate[i]
          };
      }
      
      console.log("makeFutureData:" + gaFutureDataArray.length);
      
      $scope.futureDataArray = gaFutureDataArray;
      $scope.rainFutureLoaded2 = true;
    }
    
    $scope.addJSDone = function() {
      $scope.rainFutureStationRecord = MyLabel;
      $scope.rainFutureLoaded = true;
      
      //$scope.loadDone();
      //window.location.reload(true);
      $scope.updatePage();
    }
    
    $scope.init = function() {
      if (window.cordova)
      {
          initData();
          //$scope.loadStart();
          requestNewRainfall($scope.requestRailfallDone);
      }
      
      $rootScope.$broadcast("enableAllIcon"); 
      
      // test 
      //parseTownFutureRain(RAIN_TEXT);
      //parseTownPastRain(PAST_24HR_TEMP);
      //addJS("http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/6801100_3Hr.js", $scope.addJSDone);
    }
    
    $scope.requestRailfallDone = function() {
      if (this.readyState == 4) 
      {
        parseRainfall(this.responseText);
        
        if (gsCurrentLocationName)
        {
          $scope.findLocationInfo(gsCurrentLocationName);
        }
        else
        {
          $scope.checkExtra();
        }
      }
    }
    
    $scope.findLocationInfo = function(sKeyword) {
      $scope.currentLocationName = gsCurrentLocationName;
      requestGPS(sKeyword, $scope.findRainfall);
    }
    
    $scope.checkExtra = function() {
        console.log("checkExtra : " + gbPlatformReady + "," + gbExtraChecked);
        
        if (!gbPlatformReady || gbExtraChecked)
        {
            return;
        }
        
        gbExtraChecked = true;
        
        setExtra(function(sExtra) {
            console.log("Exist Extra: " + sExtra);
            
            gsExtra = sExtra;
            gsCurrentLocationName = sExtra.trim().split("http:")[0];
            
            $scope.findLocationInfo(sExtra);
        },
        function() {
            console.log("no Extra");
            
            $scope.noLoaded();
        });
    }
    
    $scope.noLoaded = function() {
        $scope.locationLoaded = true;
        $scope.rainPastLoaded = true;
        $scope.rainPastLoaded2 = true;
        $scope.rainFutureLoaded = true;
        $scope.rainFutureLoaded2 = true;
        
        //$scope.updatePage();
    }
    
    $scope.goInfoPast = function() {
      console.log("goInfoPast");
      $rootScope.$broadcast("disableAllIcon"); 
    }
    $scope.goInfoFuture = function() {
      console.log("goInfoFuture");
      $rootScope.$broadcast("disableAllIcon"); 
    }
    
    $scope.updatePage = function() {
        $state.go($state.current, {}, {}); // page update
    }
    
    $ionicPlatform.ready(function() {
        gbPlatformReady = true;
        
        console.log("Platform Ready");
        
        $scope.initFlag();
        
        if (!gbExtraChecked)
        {
            $scope.checkExtra();
        }
        
        if (!window.cordova)
        {
            console.log("Not on device");
            
            $scope.noLoaded();
        }
    });
    
    $scope.$on('$ionicView.enter', function(e) {
        console.log("Enter infoCtrl");
        
        $scope.init();
    });
    
    $scope.searchLocation = function() {
        $ionicPopup.prompt({
            title: '天氣查詢',
            template: '  ',
            inputType: 'text',
            inputPlaceholder: '請輸入地點名稱'
            }).then(function(res) {
                console.log('location is', res);
                if (res)
                {
                   $scope.needAddHistory = true;
                  
                    gsCurrentLocationName = res;
                    $scope.currentLocationName = res;
                    requestGPS(res, $scope.findRainfall);
                }
        });
    }
    
    $scope.$on("updatePage", function() {
      console.log("receive updatePage");
      $scope.clickUpdate();
      
    });
    
    
    $scope.$on("searchLocation", function() {
      console.log("receive searchLocation");
      $scope.searchLocation();
    });
    
     
})

.controller('InfoPastCtrl', function($scope) {
  $scope.pastDataArray = gaPastDataArray;
})
.controller('InfoFutureCtrl', function($scope) {
  $scope.futureDataArray = gaFutureDataArray;
})



.controller('AppCtrl', function(
  $rootScope, $scope, $state, $ionicModal, $timeout, $ionicPlatform, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.favouriteExisted = false;
  $scope.showSearchIcon;
  $scope.showFavouriteIcon;
  $scope.showRefreshIcon;

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  $scope.enableAllIcon = function() {
    $scope.favouriteExisted = getFavouriteIndex(gsCurrentLocationName, gasTargetGPS) >= 0;
    
    $scope.showSearchIcon = true;
    $scope.showFavouriteIcon = true;
    $scope.showRefreshIcon = true;
  }
  
  $scope.disableAllIcon = function() {
    $scope.showSearchIcon = false;
    $scope.showFavouriteIcon = false;
    $scope.showRefreshIcon = false;
  }
  
  $scope.goInfo = function() {
    console.log("goInfo");
    $scope.enableAllIcon();
  }
  
  $scope.goHistory = function() {
    console.log("goHistory");
    $scope.disableAllIcon();
  }
  
  $scope.goFavourite = function() {
    console.log("goFavourite");
    $scope.disableAllIcon();
  }
  
  $scope.goOption = function() {
    console.log("goOption");
    $scope.disableAllIcon();
  }
  
  $scope.clickSearchIcon = function() {
    console.log("clickSearchIcon");
    //$scope.login();
    
    $rootScope.$broadcast("searchLocation"); 
  }
  $scope.clickFavouriteIcon = function() {
    console.log("clickFavouriteIcon");
    
    if (!gsCurrentLocationName)
    {
        console.log("not exist location name");
        return;
    }
    
    var sTitle = "加入最愛地點";
    var sQuestion = "是否要加入 " + gsCurrentLocationName + " ?";
    $scope.favouriteExisted = getFavouriteIndex(gsCurrentLocationName, gasTargetGPS) >= 0;
    if ($scope.favouriteExisted)
    {
      sTitle = "移除最愛地點";
      sQuestion = "是否要移除 " + gsCurrentLocationName + " ?";
    }
    
    var confirmPopup = $ionicPopup.confirm({
      title: sTitle,
      template: sQuestion
    });
    
    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
        
        if ($scope.favouriteExisted)
        {
          removeFavourite(gsCurrentLocationName, gasTargetGPS);
          $scope.favouriteExisted = false;
        }
        else
        {
          addFavourite(gsCurrentLocationName, gasTargetGPS, gsSnapshotUrl);
          $scope.favouriteExisted = true;
        }
      } else {
        console.log('You are not sure');
      }
    });
  }
  $scope.clickRefreshIcon = function() {
    console.log("clickRefreshIcon:");
    $rootScope.$broadcast("updatePage"); 
  }
  
  
  $scope.init = function() {
    console.log("Init");
    
  }
  
  $ionicPlatform.ready(function() {
    console.log("ionicPlatform.ready");
    $scope.enableAllIcon();
  });

  $scope.$on('$ionicView.enter', function(e) {
      var sLocation = "" + window.location;
      console.log("Enter AppCtrl:" + sLocation);
      
      if (sLocation.indexOf("browse") > 0)
      {
        $scope.showSearchIcon = true;
      }
      
      $scope.init();
  });
  
  $scope.$on("disableAllIcon", function() {
      console.log("receive disableAllIcon");
      $scope.disableAllIcon();
  });
  $scope.$on("enableAllIcon", function() {
      console.log("receive enableAllIcon");
      $scope.enableAllIcon();
  });
  
})

.controller('PlaylistsCtrl', function($scope, $state) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  
  $scope.goRight = function() {
    console.log("goRight");
    $state.go('app.option'); 
  }
  $scope.swipeDown = function() {
    console.log("swipeDown");
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  
})

.controller('FavouriteCtrl', function($scope, $stateParams) {
  $scope.favouriteDataArray = gaFavouriteDataArray;
  
  $scope.clickFavourite = function(index) {
    console.log("clickFavourite:" + index);
    
    gsCurrentLocationName = gaFavouriteDataArray[index].location;
    gasTargetGPS = [gaFavouriteDataArray[index].gps1, gaFavouriteDataArray[index].gps2];
    gsSnapshotUrl = gaFavouriteDataArray[index].snapshotUrl;
  }
})

.controller('HistoryCtrl', function($scope, $stateParams) {
  $scope.historyDataArray = gaHistoryDataArray;
  
  $scope.clickHistory = function(index) {
    console.log("clickHistory:" + index);
    
    gsCurrentLocationName = gaHistoryDataArray[index].location;
    gasTargetGPS = [gaHistoryDataArray[index].gps1, gaHistoryDataArray[index].gps2];
    gsSnapshotUrl = gaHistoryDataArray[index].snapshotUrl;
  }
});




/*

ionic run --device android

http://localhost:8100/#/tab/option
chrome://inspect/#devices

ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
ionic plugin add https://github.com/Initsogar/cordova-webintent.git

http://www.cwb.gov.tw/V7/js/select_town.js
http://www.cwb.gov.tw/V7/forecast/town368/24GTPast/plot/6801100_24Past.js
http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/6801100_3Hr.js
http://www.cwb.gov.tw/V7/forecast/town368/7Day/plot/6801100_7Day.js

http://www.cwb.gov.tw/V7/forecast/town368/24GTPast/6801300.htm

過去24小時天氣紀錄
http://www.cwb.gov.tw/V7/observe/24real/Data/46757.htm
http://www.cwb.gov.tw/V7/observe/real/ALL.htm

http://www.cwb.gov.tw/V7/symbol/weather/gif/day/36.gif


// Libary Search :

竹北文化中心
關鍵字: KEYWORD
http://203.71.213.35/toread/refineSearch.svc?base_url=%2Ftoread%2F&location=0&pn=opac%2FSearch&q=KEYWORD&view=LIST
http://203.71.213.35/toread/opac/bibliographic_view/270570?location=0&q=KEYWORD&start=0&view=LIST

新竹市圖書館
http://webpac.hcml.gov.tw/webpac/booksearch.do?searchtype=simplesearch&search_field=TI&search_input=KEYWORD


# Yahoo Dictory

https://tw.search.yahoo.com/sugg/gossip/gossip-tw-vertical_ss/?output=fxjsonp&pubid=1306&command=關鍵字&l=1&bm=3&appid=ydictionary&t_stmp=1395646717427&pq=car&nresults=10&bck=5k2ebfd9car5i%26b%3D4%26d%3DiiKfWG5pYEKrHcXKy2cw2b1DxeVOoCX5gpzCaw--%26s%3D25%26i%3D2gKtgxrQENbFmvvA7N00&csrcpvid=8J_ReDExOS5aCct7UsVsshUcMjAyLlMv4PD_0F2o&vtestid=&mtestid=null&spaceId=1351200381&callback=YUI.Env.JSONP.yui_3_9_1_1_1440932726773_483

https://tw.dictionary.yahoo.com/dictionary?p=family


# boradcast

http://broadcast.ivy.com.tw/broadcast/Broadcast_list.aspx

http://broadcast.ivy.com.tw/broadcast/Broadcast.aspx?Active=1
http://broadcast.ivy.com.tw/broadcast/Broadcast_More.aspx?MagitemID=5069
http://broadcast.ivy.com.tw/broadcast/BoardData/Enjoy/mp3/5069_2.mp3 
*/




