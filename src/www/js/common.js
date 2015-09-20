function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) 
{
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1); // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) 
{
	return deg * (Math.PI/180)
}

function getNearLocationIndex(asData, fLat, fLon)
{
	var fMinKM = 1000;
	var fMinIndex = -1;
  
  //console.log("getNearLocationIndex:" + asData[0] + ":" + asData.length + "," + fLat + "," + fLon);

	for (var i = 0; i < asData.length; i ++)
	{
		var fKM = getDistanceFromLatLonInKm(asData[i][3], asData[i][4], fLat, fLon);
		
		if (fKM < fMinKM)
		{
			fMinKM = fKM;
			fMinIndex = i;
			
			//console.log("MIN:" + fMinIndex + ":" + fMinKM);
		}
	}
  
  //console.log("Got nearest site: " + asData[fMinIndex]);
  
  gsDistance = fMinKM;
  gasStationGPS = [asData[fMinIndex][3], asData[fMinIndex][4]];
	
	return fMinIndex;
}

function parseTownPastRain(sText)
{
  var asTokens = sText.split("<tr");
  
  // 時間, 溫度, 天氣描述, 風向, 蒲福風級, 相對溼度, 累積雨量
  
  var aasPastRainData = [];
  
  for (var i = 2; i < asTokens.length; i ++)
  {
    var asRow = asTokens[i].trim().split("<td");
    var iCount = 0;
    
    for (var j = 0; j < asRow.length; j ++)
    {
      var sTemp = "<td" + asRow[j];
      var sData = sTemp.replace( /<[^<>]+>/g, " " ).trim().replace(/\s+/g, "_");
      
      if (j == 2 || j == 6 || j == 7 || j == 9)
      {
        continue;
      }
      
      if (!aasPastRainData[iCount])
      {
        aasPastRainData[iCount] = [];
      }
      
      var iCount2 = aasPastRainData[iCount].length;
      aasPastRainData[iCount][iCount2] = sData;
      
      iCount++;
    }
    
    
  }
  
  for (i = 0; i < aasPastRainData.length; i ++)
  {
    //console.log( i + " : " + aasPastRainData[i]);
  }
  
  return aasPastRainData;
}

function parseTownFutureRain(sText)
{
  var asTokens = sText.split("<tr");
  
  // 日期, 時間, 天氣狀況, 溫度, 蒲福風級, 風向, 相對溼度, 降雨機率, 舒適度
  
  var aasFutureRainData = [];

  for (var i = 1; i < asTokens.length; i ++)
  {
    var asRow = asTokens[i].trim().split("<td");
    
    var asData = [];
    
    for (var j = 2; j < asRow.length; j ++)
    {
      var sTemp = "<td" + asRow[j];
      var sData = sTemp.replace( /<[^<>]+>/g, " " ).trim().replace(/\s+/g, "_");

      if (sTemp.indexOf("<img") > 0)
      {
        var asTemp2 = sTemp.split("\"");
        sData = asTemp2[1] + "_" + asTemp2[3];
      }
      
      if (sTemp.indexOf("colspan=") > 0)
      {
        var iColspan = parseInt(sTemp.split("\"")[1]); 
        
        for (var k = 0; k < iColspan; k ++)
        {
          asData[asData.length] = sData;
        }
      }
      else
      {
        asData[asData.length] = sData;
      }
      
      
    }
    
    console.log( i + "," + j + " : " + asData);
    
    aasFutureRainData[i - 1] = asData;
  }
  
  return aasFutureRainData;
}

function parseGovData(sText)
{
	var asTokens = sText.split("<tbody>")[1].split("<tr");
	var asUsedLocation = [];
	
	gasUpdateData = []; // init
	
	for (var i = 1; i < asTokens.length - 1; i ++)
	{
		var iBegin = asTokens[i].indexOf(">");
		var temp = asTokens[i].substring(iBegin + 1, asTokens[i].length);
		var text = temp.replace( /<[^<>]+>/g, " " ).trim().replace(/\s+/g, ",");
		
		var index = 0;
    var bFound = false;

		for (index = 0; index < asUsedLocation.length; index++)
		{
			if (asUsedLocation[index] && text.indexOf(asUsedLocation[index]) == 0)
			{
				//console.log("#" + index + ":" + asUsedLocation[index]);
        bFound = true;
				break;
			}
		}
		
		asUsedLocation[index] = text.substring(0, 3);

		if (!bFound)
		{
			gasUpdateData[index] = [];
			//console.log("#" + index + "_" + asUsedLocation[index]);
		}
    
		var j = gasUpdateData[index].length;
		gasUpdateData[index][j] = text;
		
		//console.log(index + "," + j + "_" + text);
	}
}

function getGovDataInfo(sID)
{
	for (var i = 0; i < gasUpdateData.length; i ++)
	{
    for (var j = 0; j < gasUpdateData[i].length; j ++)
    {
      if (gasUpdateData[i][j].indexOf(sID) > 0)
      {
        return gasUpdateData[i][j];
      }
    }
	}
	
	return null;
}

function paserRainfallData(sKeyword)
{
  var aData = [];
	for (var i = 0; i < gasUpdateData.length; i ++)
	{
    for (var j = 0; j < gasUpdateData[i].length; j ++)
    {
      if (gasUpdateData[i][j].indexOf(sKeyword) >= 0)
      {
        var iLast = aData.length;
        aData[iLast] = parseRainfallData(iLast, gasUpdateData[i][j], isNightNow());
      }
    }
	}
  
  console.log("paserRainfallData : found " + aData.length + " data by " + sKeyword);
  
  if (aData && aData[0])
  {
    gsRainPastRecord = aData[0].description;
    gsRainPastIcon = aData[0].icon;
  }
}

/*

大雨	24 小時累積雨量達80 毫米以上，或時雨量達40 毫米以上之降雨現象。
豪雨	24 小時累積雨量達200 毫米以 上，或3 小時累積雨量達100 毫 米以上之降雨現象。
大豪雨	24 小時累積雨量達350 毫米以 上之降雨現象。
超大豪雨	24 小時累積雨量達500 毫米以 上之降雨現象。


*/

var parseRainfallData = function(iNo, sOriginData, bIsNight)
{
  var asOriginData = sOriginData.split(",");
  
  var sLocation = asOriginData[0] + "," + asOriginData[1];
  
  
  var i10MinRainfall = parseInt(asOriginData[3]) | 0;
  var i1HourRainfall = parseInt(asOriginData[4]) | 0;
  var i3HourRainfall = parseInt(asOriginData[5]) | 0;
  var i6HourRainfall = parseInt(asOriginData[6]) | 0;
  var i12HourRainfall = parseInt(asOriginData[7]) | 0;
  var i24HourRainfall = parseInt(asOriginData[8]) | 0;
  var sDescription = "累積雨量 : " + i10MinRainfall + "(10min) -> " + i1HourRainfall + "(1hr) -> " + i3HourRainfall + "(3hr) -> " + i6HourRainfall + "(6hr) -> " + i12HourRainfall + "(12hr) -> " + i24HourRainfall + "(24hr)";
  
  var sIcon;
  
  if (i24HourRainfall >= 80 || i1HourRainfall >= 40)
  {
    sIcon = getRailfallIcon(4, bIsNight);
  }
  else if (i10MinRainfall > 0)
  {
    sIcon = getRailfallIcon(3, bIsNight);
  }
  else if (i1HourRainfall > 0)
  {
    sIcon = getRailfallIcon(1, bIsNight);
  }
  else 
  {
    sIcon = getRailfallIcon(0, bIsNight);
  }
  
  return {
    id: iNo,
    location: sLocation,
    description: sDescription,
    icon: sIcon
  };
}

var fClickUpdate = function()
{
  console.log("Update !");
  requestNewRainfall();
  
}

var fSearchLocation = function()
{
  buildRainfallData();
  
  var sText = getGovDataInfo(GOV_DATA[1][2]);
  
  console.log("[fSearchLocation]OLD:" + GOV_DATA[1][2]);
  console.log("[fSearchLocation]NEW:" + sText);
  
  return sText;
}

var buildRainfallData = function()
{
  parseGovData(GOV_TEXT);
	
	console.log("[buildRainfallData]Total location: " + gasUpdateData.length);
}

var getRainfallInfo = function(sKeyword) {
  
  console.log("getRainfallInfo : " + sKeyword);

  return getGovDataInfo(sKeyword);
}

var getRailfallIcon = function(iLevel, bIsNight)
{
  var asDayIcon = ["ion-ios-sunny-outline", "ion-ios-partlysunny-outline", "ion-ios-cloudy-outline", "ion-ios-rainy-outline", "ion-ios-thunderstorm-outline"];
  
  var asNightIcon = ["ion-ios-moon-outline", "ion-ios-cloudy-night-outline", "ion-ios-cloudy-outline", "ion-ios-rainy-outline", "ion-ios-thunderstorm-outline"];
  
  var sIcon = bIsNight ? asNightIcon[iLevel] : asDayIcon[iLevel];
  
  console.log("getRailfallIcon : " + sIcon);
  
  return sIcon;
}

var isNightNow = function() {
  
  return false;
}

function sendHttpRequest(sUrl, onReadyFunction)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = onReadyFunction;
  xhr.open("GET", sUrl, true);
  xhr.send();
}

function requestNewRainfall(fDoneFunction)
{
  var sUrl = "http://www.cwb.gov.tw/V7/observe/rainfall/A136.htm";
  sendHttpRequest(sUrl, fDoneFunction);
}

function parseRainfall(sResponseText)
{
  parseGovData(sResponseText);
  console.log("parse New Railfall done");
}

function requestGPS(sExtra, fFindRainfall)
{  
  gasTargetGPS = null; // init
  
  var sMapHost = "http://goo.gl/maps/";
  var sUrl;
  
  sExtra = sExtra.trim();
  
  if (sExtra.indexOf(sMapHost) > 0)
  {
    var iBegin = sExtra.indexOf(sMapHost);
    var iEnd = sExtra.length;
    
    sUrl = sExtra.substring(iBegin, iEnd);
  }
  else
  {
    var sKeyword = sExtra.split(" ")[0];
    sUrl = "https://www.google.com.tw/maps/place/" + encodeURIComponent(sKeyword);
  }

  sendHttpRequest(sUrl, fFindRainfall);
}

function parseGPS(sResponseText)
{
  console.log("LEN:" + sResponseText.length);
  
  
  
  var iBegin = sResponseText.indexOf("[[[") + 3;
  var iEnd = sResponseText.indexOf("]", iBegin);
  var asTemps = sResponseText.substring(iBegin, iEnd).split(",");
  
  for (var i = 0; i < 3; i ++)
  {
    if (asTemps[i].length > 9)
    {
      asTemps[i] = asTemps[i].substring(0, 9);
    }
  }

  gasTargetGPS = [asTemps[2], asTemps[1]];
  
  console.log("parse GPS done : " + asTemps[2] + "," + asTemps[1]);

  console.log(sResponseText);
  
  console.log("Screen: width:" + window.innerWidth + ",Height:" + window.innerHeight);
  var iWidth = parseInt(window.innerWidth * 0.8);
  var iHeight = parseInt(window.innerHeight * 0.2);
  console.log("Pic: width:" + iWidth + ",Height:" + iHeight);
  
  // change the location name
  var sGPS = ",[" + asTemps[2] + "," + asTemps[1] + "],";
  
  if (sResponseText.indexOf(sGPS) > 0)
  {
    iEnd = sResponseText.indexOf(sGPS);
    iEnd = sResponseText.lastIndexOf("\"", iEnd);
    iBegin = sResponseText.lastIndexOf("\"", iEnd - 1) + 1;
    var sNewLocation = sResponseText.substring(iBegin, iEnd);
    console.log("New Location name : " + sNewLocation);
    
    gsCurrentLocationName = sNewLocation;
  }
    
  
  
  iBegin = sResponseText.indexOf("//geo0.ggpht.com/cbk");
  iEnd = sResponseText.indexOf("\"", iBegin);

  if (iEnd > iBegin && iBegin > 10)
  {
    var sTemp = sResponseText.substring(iBegin, iEnd);
    sTemp = "https:" + sTemp.replace(/\\u0026/g, "&");
    
    var sFirst = sTemp.split("&w=")[0];
    var sLast = sTemp.split("&yaw=")[1];
    
    gsSnapshotUrl = sFirst + "&w=" + iWidth + "&h=" + iHeight + "&yaw=" + sLast;
    
    console.log("Snapshot url 1:" + gsSnapshotUrl);
    
    // http://www.google.com/cbk?cb_client=search.TACTILE\u0026output=report\u0026panoid=F_kCflnDxtJYpjJLbqmMDg https://geo0.ggpht.com/cbk?cb_client=maps_sv.lite_mobile&output=thumbnail&thumb=2&panoid=F_kCflnDxtJYpjJLbqmMDg&w=288&h=113&yaw=347&pitch=0&thumbfov=120&ll=24.0753,120.4305
  }
  else 
  { 
    var sPanoid = null;
    
    if (sResponseText.indexOf("u0026panoid") > 0)
    {
      iBegin = sResponseText.indexOf("u0026panoid");
      iBegin = sResponseText.indexOf("=", iBegin) + 1;
      iEnd = sResponseText.indexOf("\"", iBegin);
      sPanoid = sResponseText.substring(iBegin, iEnd);
    }
    else 
    {
      var asTemp = sResponseText.split(",");
      var iCount = asTemp.length;
      var sExamplePanoid = "sAQdAAkKXJA3jlhFGkhymA";
      
      for (var i = 0; i < iCount; i++)
      {
        var sTemp = asTemp[i].trim();
        
        if (sTemp[0] == "\"" && sTemp[sTemp.length - 1] == "\"")
        {
          sTemp = sTemp.substring(1, sTemp.length - 1);
          
          if (sTemp.indexOf("https://plus.google.com/") == 0)
          {
            console.log("Request : " + sTemp);
            sendHttpRequest(sTemp, parsePicFromGooglePlus);
          }
          
          /*
          if (sTemp.length == sExamplePanoid.length)
          {
            sPanoid = sTemp;
            console.log("MATCH: " + sTemp);
            //break;
          }
          */
          console.log("NOT MATCH: " + sTemp);
        }
        
      }
    }

    console.log("Exist panoid : " + sPanoid);
    
    if (!sPanoid)
    {
      return;
    }

    gsSnapshotUrl = "https://geo0.ggpht.com/cbk?cb_client=maps_sv.lite_mobile&output=thumbnail&thumb=2&panoid=" + sPanoid + "&w=" + iWidth + "&h=" + iHeight + "yaw=347&pitch=0&thumbfov=120&ll=" + asTemps[2] + "," + asTemps[1];

    console.log("Snapshot url 2:" + gsSnapshotUrl);
  } 
}

function parsePicFromGooglePlus()
{
  if (this.readyState == 4 || 
      (this.readyState == 3 && this.responseText.indexOf("/maps/vt/data=") > 0))
  {
    var sResponseText = this.responseText;
    
    var iEnd = sResponseText.indexOf("/maps/vt/data=");
    iEnd = sResponseText.indexOf("\"", iEnd);
    var iBegin = sResponseText.lastIndexOf("\"") + 1;
    
    gsSnapshotUrl = "https:" + sResponseText.substring(iBegin, iEnd);

    console.log("Snapshot url 3:" + gsSnapshotUrl);
  }
}

function setExtra(fDoneFunction, fFailFunction)
{
  if (!window.plugins || !window.plugins.webintent)
  {
    return;
  }
  
  window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
    /*
    function(sExtra) {
      // url is the value of EXTRA_TEXT
      console.log("EXTRA_TEXT:" + sExtra);
      
      gsExtra = sExtra;
    }*/
    fDoneFunction, 
    fFailFunction);
}

function getRedirectUrl(sUrl)
{
  var xhr = new XMLHttpRequest();
  xhr.onload = function(e){
    var headers = xhr.getAllResponseHeaders().toLowerCase();
    alert(headers);
  }
  xhr.open("GET", sUrl, true);
  xhr.send();
}

function addJS( sJsFile, fDoneFunction )
{ 
  var oScript = document.createElement("script");

  if ( oScript.onreadystatechange != undefined )
  {
    oScript.type = "text/javascript";
    oScript.src = sJsFile;
    oScript.onreadystatechange = function() {
      if (this.readyState == 'complete') 
      {
        //alert( "complete :" + gsCurrentBasicIntroduction );
        fDoneFunction();
      }
      else if (this.readyState == 'loaded') 
      {
        fDoneFunction();
      }
    };
    //head.appendChild(oScript);
    document.head.appendChild(oScript);
  }
  else
  {
    oScript.type = "text/javascript";
    oScript.src = sJsFile;
    oScript.async = true;
    //oHead.appendChild( oScript);
    oScript.onload = fDoneFunction;
    document.head.appendChild(oScript);
    //unlockWait();
  }
}

function clickKeyword()
{
  $ionicPopup.prompt({
    title: 'Password Check',
    template: 'Enter your secret password',
    inputType: 'password',
    inputPlaceholder: 'Your password'
    }).then(function(res) {
    console.log('Your password is', res);
  });
}

function removeFavourite(iNo)
{
  var iCount = gaFavouriteDataArray.length;
  
  for (var i = iNo + 1; i < iCount; i++)
  {
    gaFavouriteDataArray[i - 1] = gaFavouriteDataArray[i];
  }
  
  removeFavouriteData(iNo);
  
  console.log("Remove Favourite " + iNo);
}  

function addFavourite(sLocation, asGps, sImageUrl)
{
  if (!asGps || asGps.length != 2)
  {
    asGps = ["X", "X"];
  }
  var iNo = gaFavouriteDataArray.length;
  var favouriteData = {
        id: iNo,
        location: sLocation, 
        gps1: asGps[0], 
        gps2: asGps[1],
        snapshotUrl: sImageUrl};
        
  gaFavouriteDataArray[iNo] = favouriteData;
  
  setFavouriteData(favouriteData, iNo);

  console.log("Add Favourite " + iNo + " : " + sLocation);
}

function getFavouriteIndex(sLocation, asGps)
{
  if (!asGps || asGps.length != 2)
  {
    asGps = ["X", "X"];
  }
  for (var i = 0; i < gaFavouriteDataArray.length; i ++)
  {
    if (!gaFavouriteDataArray[i])
    {
      continue;
    }
    if (gaFavouriteDataArray[i].location == sLocation && 
        asGps && gaFavouriteDataArray[i].gps1 == asGps[0] &&
        gaFavouriteDataArray[i].gps2 == asGps[1])
    {
      return i;
    }
  }

  return -1;
}

function removeFavourite(sLocation, asGps)
{
  var iFavouriteIndex = getFavouriteIndex(sLocation, asGps);

  if (iFavouriteIndex >= 0)
  {
    var iCount = gaFavouriteDataArray.length;
    
    for (var i = iFavouriteIndex + 1; i < iCount; i++)
    {
      gaFavouriteDataArray[i - 1] = gaFavouriteDataArray[i];
    }
    
    removeFavouriteData(iFavouriteIndex);

    console.log("Remove Favourite " + iFavouriteIndex + " : " + sLocation);
  }
  else
  {
    console.log(sLocation + " cannot be found !!");
  }
}


function addHistory(sLocation, asGps, sImageUrl)
{
  if (!asGps || asGps.length != 2)
  {
    asGps = ["X", "X"];
  }
  var iNo = gaHistoryDataArray.length;
  var historyData = {
        id: iNo,
        location: sLocation, 
        gps1: asGps[0], 
        gps2: asGps[1],
        snapshotUrl: sImageUrl};
        
  gaHistoryDataArray[iNo] = historyData;
  
  setHistoryData(historyData, iNo);

  console.log("Add History " + iNo + " : " + sLocation);
}

function initData()
{
  var iFavouriteCount = getFavouriteCount();
  
  for (var i = 0; i < iFavouriteCount; i ++)
  {
    gaFavouriteDataArray[i] = getFavouriteData(i);
  }
  
  var iHistoryCount = getHistoryCount();
  
  for (var i = 0; i < iHistoryCount; i ++)
  {
    gaHistoryDataArray[i] = getHistoryData(i);
  }
  
  console.log("Load Favourite Count : " + iFavouriteCount );
  console.log("Load History Count : " + iHistoryCount );
}