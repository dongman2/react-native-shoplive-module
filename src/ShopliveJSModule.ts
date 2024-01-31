import {NativeModules} from 'react-native';
const {ShopliveModule} = NativeModules;
import {addEventListener, removeEventListener} from './EventEmitter';
import type {EventData} from './EventEmitter';

class ShopliveJSModule {

  onHandleNavigation = (listener: (payload: EventData) => void) => {
    addEventListener('handleNavigation', (payload: EventData) =>
      listener(payload),
    );
  };
  onDownloadCoupon = (listener: (payload: EventData) => void) => {
    addEventListener('downloadCoupon', (payload: EventData) =>
      listener(payload),
    );
  };
  
  
  onReceivedCommand = (listener: (payload: EventData) => void) => {
    addEventListener('onReceivedCommand', (payload: EventData) =>
      listener(payload),
    );
  }

  onError = (listener: (payload: EventData) => void) => {
    addEventListener('onError', (payload: EventData) => listener(payload));
  };
  onPlayerClosing = (listener: (payload: EventData) => void) => {
    addEventListener('playerClosing', (payload: EventData) =>
      listener(payload),
    );
  };
  onPlayerDestroyed = (listener: (payload: EventData) => void) => {
    addEventListener('playerDestroyed', (payload: EventData) =>
      listener(payload),
    );
  };
  onPlayerCreated = (listener: (payload: EventData) => void) => {
    addEventListener('playerCreated', (payload: EventData) =>
      listener(payload),
    );
  };

  removeListeners = () => {
    removeEventListener('handleNavigation');
    removeEventListener('downloadCoupon');
    removeEventListener('CLICK_PRODUCT_DETAIL');
    removeEventListener('onError');
    removeEventListener('playerClosing');
    removeEventListener('playerDestroyed');
    removeEventListener('playerCreated');
  }

  setAccessKey(accessKey: string) {
    ShopliveModule.setAccessKey(accessKey);
  }

  play(campaignKey: string) {
    console.log('playShoplive', campaignKey);
    ShopliveModule.play(campaignKey);
  }

  setShareUrl(url:string) {
    ShopliveModule.setShareUrl(url);
  }  

}
export default ShopliveJSModule;
