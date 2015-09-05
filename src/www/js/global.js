
var gasUpdateData = [];

var gasTargetGPS = null;
var gasStationGPS = null;
var gsExtra = null;
var gsMapUrl = null;
var gsLocation = null;
var gsDistance = null;

var gbExtraChecked = false;
var gbPlatformReady = false;


// tab-new
var gsSnapshotUrl = null;
var gsExtra = null;
var gsCurrentLocationName = null;
var gsRainPastRecord = null;
var gsRainPastIcon = null;
var gaHistoryDataArray = [];
                /*[{
                id: "編號",
                location: "名稱", 
                gps1: "經度", 
                gps2: "緯度", 
                snapshotUrl: "照片"}];*/
var gaFavouriteDataArray = [];
                /*[{
                id: "編號",
                location: "名稱", 
                gps1: "經度", 
                gps2: "緯度", 
                snapshotUrl: "照片"}];*/

var gaPastDataArray = [{
                rainPastTime: "時間", 
                rainPastTemperature: "溫度", 
                rainPastState: "狀況", 
                rainPastRelative: "相對溼度",
                rainPastRainfall: "累積雨量"}];
var gaFutureDataArray = [{
                rainFutureTime: "時間",
                rainFutureTemperature: "溫度",
                rainFutureExistIcon: false,
                rainFutureState: "狀態",
                rainFutureRelative: "相對溼度",
                rainFutureRate: "降雨機率"}];
