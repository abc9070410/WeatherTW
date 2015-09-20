# WeatherTW
A Android app about weather using Ionic

## How to use

1. install Ionic : http://ionicframework.com/getting-started/
2. open the terminal window, move to the specific directory
3. type `ionic start WeatherTW sidemenu`, move to the .\WeatherTW
4. type `ionic platform add android`
5. add the following plugins :  
  `ionic plugin add https://github.com/Initsogar/cordova-webintent.git`  
  `ionic plugin add org.apache.cordova.inappbrowser`  
  `ionic plugin add org.apache.cordova.network-information`  
6. add the following segment into .\WeatherTW\platforms\android\AndroidManifest.xml :  
    `<intent-filter>`  
        `<action android:name="android.intent.action.SEND" />`  
        `<category android:name="android.intent.category.DEFAULT" />`  
        `<data android:mimeType="text/plain" />`  
    `</intent-filter>`  
7. copy the `src\www` to replace `.\WeatherTW\www`
8. type `ionic serve` , then the app runs on the browser

## How to install on the Android device

1. connect the PC and your device (enable the USB debugging first : http://www.kingoapp.com/root-tutorials/how-to-enable-usb-debugging-mode-on-android.htm) 
2. open the terminal window, move to the directory of WeatherTW
3. type `ionic run --device android`
4. run the APP on your device now

## Main Feature

get the weather information for the specific place form Gmap :  
https://github.com/abc9070410/WeatherTW/blob/master/DEMO_1.md
