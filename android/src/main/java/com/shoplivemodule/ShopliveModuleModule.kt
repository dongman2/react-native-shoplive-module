package com.shoplivemodule

import android.content.Context
import android.util.Log
import cloud.shoplive.sdk.ShopLive
import cloud.shoplive.sdk.ShopLiveHandler
import cloud.shoplive.sdk.ShopLiveHandlerCallback
import cloud.shoplive.sdk.ShopLivePlayerData
import cloud.shoplive.sdk.ShopLiveUser
import cloud.shoplive.sdk.ShopLiveUserGender
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONObject

class ShopliveModuleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  init {
        ShopLive.setHandler(object : ShopLiveHandler() {

            override fun onChangedPlayerStatus(
                isPipMode: Boolean,
                playerLifecycle: ShopLive.PlayerLifecycle) {
                when(playerLifecycle) {
                    ShopLive.PlayerLifecycle.CREATED -> {
                        val params = Arguments.createMap()
                        params.putString("isPIP",isPipMode.toString())
                        sendEvent(reactApplicationContext, "playerCreated",params)
                    }
                    ShopLive.PlayerLifecycle.CLOSING -> {
                        val params = Arguments.createMap()
                        params.putString("isPIP",isPipMode.toString())
                        sendEvent(reactApplicationContext, "playerClosing",params)

                    }
                    ShopLive.PlayerLifecycle.DESTROYED -> {
                        val params = Arguments.createMap()
                        params.putString("isPIP",isPipMode.toString())
                        sendEvent(reactApplicationContext, "playerDestroyed",params)
                    }
                }
            }
            override fun handleNavigation(context: Context, url: String) {
                // Do something
                val params = Arguments.createMap()
                params.putString("url", url)
                sendEvent(reactApplicationContext, "handleNavigation", params)
            }
            override fun handleDownloadCoupon(context: Context, couponId: String, callback: ShopLiveHandlerCallback) {
                //Do something
                val params = Arguments.createMap()
                params.putString("couponId", couponId)
                sendEvent(reactApplicationContext, "downloadCoupon", params)
            }
            override fun onError(context: Context, code: String, message: String) {
                //Do something
                val params = Arguments.createMap()
                params.putString("code", code)
                params.putString("message", message)
                sendEvent(reactApplicationContext, "onError", params)
            }
            override fun onReceivedCommand(
                context: Context,
                command: String,
                data: JSONObject
            ) {
                //exporting the onReceivedCommand event directly with command and data so that it can be easily extended
                Log.v("Shoplive log","onReceivedCommand")
                val params = Arguments.createMap()
                params.putString("command", command)
                params.putString("data", data.toString())
                sendEvent(reactApplicationContext, "onReceivedCommand", params)


            }
        })
    }

    override fun getName() = "ShopliveModule"

    @ReactMethod fun helloShoplive() {
        Log.v("dklog","hello Shoplive Android")

    }

    @ReactMethod fun setAccessKey(ak:String) {
        ShopLive.setAccessKey(ak)
    }
    @ReactMethod fun play(ck:String) {

        ShopLive.play(reactApplicationContext , ShopLivePlayerData(ck).apply {
            keepWindowStateOnPlayExecuted = false
            referrer = "referrer"
        })
    }

    @ReactMethod
    fun setShareUrl(schemeUrl: String?) {
        ShopLive.setShareScheme(schemeUrl)
    }

    @ReactMethod
    fun setUser(userId: String?, userName: String?) {
        val user = ShopLiveUser()
        user.userId = userId
        user.userName = userName
        user.age = 20
        user.gender = ShopLiveUserGender.Female
        user.userScore = 100
        ShopLive.setUser(user)
    }
    private fun sendEvent(
        reactContext: ReactContext,
        eventName: String,
        params: WritableMap?
    ) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
