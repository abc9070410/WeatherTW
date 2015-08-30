angular.module('starter.controllers', [])

.controller('NewCtrl', function($scope, $state, $ionicLoading, $ionicPlatform, $ionicPopup) {
    
    $scope.pastDataArray = [];
    $scope.futureDataArray = [];
    
    $scope.locationLoaded = false;
    $scope.rainPastLoaded = false;
    $scope.rainPastLoaded2 = false;
    $scope.rainFutureLoaded = false;
    $scope.rainFutureLoaded2 = false;
    
    
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
    $scope.clickUpdate = function() {
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
    };
    $scope.findRainfall = function() {
        if ((this.readyState == 3 || this.readyState == 4) && 
            this.responseText.indexOf("\"spotlight\"") > 0)
        {
            parseGPS(this.responseText);
            
            $scope.currentLocationGPS = gasTargetGPS;
            $scope.locationLoaded = true;
            $scope.updatePage();
            
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
    
    //$scope.clickSearch = fSearchLocation;
    $scope.clickSearch = function() {
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
            //$scope.loadStart();
            requestNewRainfall($scope.requestRailfallDone);
        }
        
        // test 
        //parseTownFutureRain(RAIN_TEXT);
        //parseTownPastRain(PAST_24HR_TEMP);
        //addJS("http://www.cwb.gov.tw/V7/forecast/town368/3Hr/plot/6801100_3Hr.js", $scope.addJSDone);
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
        
        gbExtraChecked = true;
        
        setExtra(function(sExtra) {
            console.log("Exist Extra: " + sExtra);
            
            gsExtra = sExtra;
            gsCurrentLocationName = sExtra.trim().split("http:")[0];
            $scope.currentLocationName = gsCurrentLocationName;
            
            requestGPS(sExtra, $scope.findRainfall);
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
        
        $scope.updatePage();
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
    });
    
    $scope.$on('$ionicView.enter', function(e) {
        console.log("Enter NewCtrl");
        
        $scope.init();
    });
    
    $scope.clickSearchIcon = function() {
        $ionicPopup.prompt({
            title: '天氣查詢',
            template: '  ',
            inputType: 'text',
            inputPlaceholder: '請輸入地點名稱'
            }).then(function(res) {
                console.log('location is', res);
                if (res)
                {
                    gsCurrentLocationName = res;
                    $scope.currentLocationName = res;
                    requestGPS(res, $scope.findRainfall);
                }
        });
    }
    
    $scope.clickFavouriteIcon = function() {
        if (!$scope.currentLocationName)
        {
            console.log("not exist location name");
            return;
        }
        
        var confirmPopup = $ionicPopup.confirm({
        title: '加入常用地點',
        template: '是否要加入 ' + $scope.currentLocationName + ' ?'
        });
        
        confirmPopup.then(function(res) {
            if(res) {
            console.log('You are sure');
            } else {
            console.log('You are not sure');
            }
        });
     };
})

.controller('NewPastCtrl', function($scope) {
  $scope.pastDataArray = gaPastDataArray;
})
.controller('NewFutureCtrl', function($scope) {
  $scope.futureDataArray = gaFutureDataArray;
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
      
      $scope.chats = paserRainfallData(inputKeyword);
      $scope.prevInputKeyword = inputKeyword;
      
      $scope.updatePage();
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

過去24小時天氣紀錄
http://www.cwb.gov.tw/V7/observe/24real/Data/46757.htm
http://www.cwb.gov.tw/V7/observe/real/ALL.htm


// Libary Search :

竹北文化中心
關鍵字: KEYWORD
http://203.71.213.35/toread/refineSearch.svc?base_url=%2Ftoread%2F&location=0&pn=opac%2FSearch&q=KEYWORD&view=LIST
http://203.71.213.35/toread/opac/bibliographic_view/270570?location=0&q=KEYWORD&start=0&view=LIST

新竹市圖書館
http://webpac.hcml.gov.tw/webpac/booksearch.do?searchtype=simplesearch&search_field=TI&search_input=KEYWORD


# Yahoo Dictory

https://tw.search.yahoo.com/sugg/gossip/gossip-tw-vertical_ss/?output=fxjsonp&pubid=1306&command=關鍵字&l=1&bm=3&appid=ydictionary&t_stmp=1395646717427&pq=car&nresults=10&bck=5k2ebfd9car5i%26b%3D4%26d%3DiiKfWG5pYEKrHcXKy2cw2b1DxeVOoCX5gpzCaw--%26s%3D25%26i%3D2gKtgxrQENbFmvvA7N00&csrcpvid=8J_ReDExOS5aCct7UsVsshUcMjAyLlMv4PD_0F2o&vtestid=&mtestid=null&spaceId=1351200381&callback=YUI.Env.JSONP.yui_3_9_1_1_1440932726773_483

https://tw.dictionary.yahoo.com/dictionary?p=anime

*/




