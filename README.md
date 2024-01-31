# Shoplive module for react native for easier integration

## Documentation
1. download module by running : 
```bash
npm install react-native-applovin-max
```

1-2. run pod install in ios folder to install dependencies
```bash
pod install --repo-update
```

2. import modules and create instance

```javascript
import {ShopliveJSModule} from "react-native-shoplive-module";
import type {EventData} from "react-native-shoplive-module";
const shoplive = new ShopliveJSModule();
```

3. Adding handlers

```javascript
shoplive.onHandleNavigation((payload: EventData) => {
      console.log('addhandleNavigationEventListener ', payload);
    });
    shoplive.onDownloadCoupon((payload: EventData) => {
      console.log('addDownloadCouponEventListener ', payload);
    });
    

    shoplive.onReceivedCommand((payload: EventData) => {
      console.log('onReceivedCommand ', payload);
      if ('command' in payload) {
        const data = JSON.parse(payload.data);
        switch (payload.command) {
          case 'CLICK_PRODUCT_DETAIL':
            //need to check the payload!!!!!!ios!!!!!!!!!!!!
            if ('url' in data) console.log('click on product:', data.url);
            break;
        }
      }
    });

    shoplive.onError((payload: EventData) => {
      console.log('onError hahahaha', payload);
    });
    shoplive.onPlayerClosing((payload: EventData) => {
      console.log('onPlayerClosing hahahaha', payload);
      if (Platform.OS === 'ios') {
        console.log(`player is chaging to PIP / or being closed`);
      } else if (Platform.OS === 'android') {
        console.log(`playerClosing`);
      }
    });
    shoplive.onPlayerDestroyed((payload: EventData) => {
      console.log('onPlayerDestroyed hahahaha', payload);
      if (Platform.OS === 'ios') {
        console.log(`player has changed to PIP / or has closed`);
      } else if (Platform.OS === 'android') {
        console.log(`player closed`);
      }
    });
    shoplive.onPlayerCreated((payload: EventData) => {
      console.log('onPlayerCreated', payload);
    });
```

4. running campaign by setting accessKey and playing with campaignKey
```javascript
shoplive.setAccessKey(ACCESSKEY);
shoplive.play(CAMPAIGNKEY);
```

## Demo Apps
The `/example` directory contains the demo app. Gradle and CocoaPods automatically pulls in the React Native module for easier debugging.

