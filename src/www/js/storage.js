var gStoredItem = [];

function setItem( key, value )
{
    if ( notSupportStored() )
    {
        gStoredItem[key] = value;
    }
    else if ( !window.localStorage )
        setCookie( key, value, 100 );
    else
        localStorage.setItem( key, value );
}

function getItem( key )
{
    if ( notSupportStored() )
    {
        return gStoredItem[key];
    }
    else if ( !window.localStorage )
        return getCookie( key );
    else
        return localStorage.getItem( key );
}

function notSupportStored()
{
  return false;
}

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
    {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1)
    {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function removeItem( key )
{
    if ( document.all && !window.localStorage )
    {
        document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    else
    {
        localStorage.removeItem( key );
    }
}


function removeAllItem()
{
    if ( document.all && !window.localStorage )
    {
        for ( var i = 0; i < KEY_ALL_ARRAY.length; i ++ )
        {
            var key = KEY_ALL_ARRAY[i];
            document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        showAlert( "all cookie are clear" );
    }
    else
    {
        localStorage.clear();
        showAlert( "all local storage are clear" );
    }
}


// ------------- Favourite Data ---------------

function favouriteDataToString(favouriteData)
{
  var sTag = "☆";
  return "" + favouriteData.id + sTag + favouriteData.location + sTag + favouriteData.gps1 + sTag + favouriteData.gps2 + sTag + favouriteData.snapshotUrl;
}

function stringToFavouriteData(sData)
{
  var sTag = "☆";
  var asData = sData.split(sTag);
  
  return {
    id: asData[0],
    location: asData[1], 
    gps1: asData[2], 
    gps2: asData[3],
    snapshotUrl: asData[4]};
}

function setFavouriteCount(iCount)
{
  setItem(KEY_FAVOURITE_COUNT, iCount);
  
  console.log("Set Favourite Count : " + iCount);
}

function getFavouriteCount()
{
  return parseInt(getItem(KEY_FAVOURITE_COUNT), 10);
}

function setFavouriteData(favouriteData, iNo)
{
  var sKey = KEY_FAVOURITE_INDEX + iNo;
  var sData = favouriteDataToString(favouriteData);
  
  setFavouriteCount(iNo + 1);
  
  setItem(sKey, sData);
}

function getFavouriteData(iNo)
{
  var sKey = KEY_FAVOURITE_INDEX + iNo;
  var sData = getItem(sKey);
  
  return stringToFavouriteData(sData);
}

function removeFavouriteData(iNo)
{
  var iCount = getFavouriteCount();
  
  for (var i = iNo + 1; i < iCount; i ++)
  {
    var favouriteData = getFavouriteData(i);
    setFavouriteData(favouriteData, i - 1); 
  }
  
  setFavouriteCount(iCount - 1);
}






// ------------- History Data ---------------


function historyDataToString(historyData)
{
  var sTag = "☆";
  return "" + historyData.id + sTag + historyData.location + sTag + historyData.gps1 + sTag + historyData.gps2 + sTag + historyData.snapshotUrl;
}

function stringToHistoryData(sData)
{
  var sTag = "☆";
  var asData = sData.split(sTag);
  
  return {
    id: asData[0],
    location: asData[1], 
    gps1: asData[2], 
    gps2: asData[3],
    snapshotUrl: asData[4]};
}

function setHistoryCount(iCount)
{
  setItem(KEY_HISTORY_COUNT, iCount);
  
  console.log("Set History Count : " + iCount);
}

function getHistoryCount()
{
  return parseInt(getItem(KEY_HISTORY_COUNT), 10);
}

function setHistoryData(historyData, iNo)
{
  var sKey = KEY_HISTORY_INDEX + iNo;
  var sData = historyDataToString(historyData);
  
  setHistoryCount(iNo + 1);
  
  setItem(sKey, sData);
}

function getHistoryData(iNo)
{
  var sKey = KEY_HISTORY_INDEX + iNo;
  var sData = getItem(sKey);
  
  return stringToHistoryData(sData);
}

function removeHistoryData(iNo)
{
  var iCount = getHistoryCount();
  
  for (var i = iNo + 1; i < iCount; i ++)
  {
    var historyData = getHistoryData(i);
    setHistoryData(historyData, i - 1); 
  }
  
  setHistoryCount(iCount - 1);
}

