package com.shoplivemodule

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import cloud.shoplive.sdk.ShopLive
import cloud.shoplive.sdk.ShopLiveHandler
import cloud.shoplive.sdk.ShopLiveHandlerCallback
import cloud.shoplive.sdk.ShopLivePlayerData
import cloud.shoplive.sdk.ShopLiveUser
import cloud.shoplive.sdk.ShopLiveUserGender

class ShopliveModuleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }
  @ReactMethod fun play(ck:String) {

      
        ShopLive.play(reactApplicationContext , ShopLivePlayerData(ck).apply {
            keepWindowStateOnPlayExecuted = false
            referrer = "referrer"
        })
  }
  @ReactMethod 
  fun setAccessKey(ck: String) {
        ShopLive.setAccessKey(ck)  
  }

  @ReactMethod
  fun addListener(type: String?) {
      // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(type: Int?) {
      // Keep: Required for RN built in Event Emitter Calls.
  }



  companion object {
    const val NAME = "ShopliveModule"
  }
}
