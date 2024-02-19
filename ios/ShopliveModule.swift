import ShopliveSDKCommon
import ShopLiveSDK

@objc(ShopliveModule)
class ShopliveModule: RCTEventEmitter {
  
  //Original method from AwesomeProject
  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }

  lazy var shopliveHandler = ShopLiveHandler(self)
  
  override init() {
    super.init()
    ShopLive.delegate = shopliveHandler
  }
  @objc
  open override func supportedEvents() -> [String]! {
    ["handleNavigation", "downloadCoupon", "onError","playerClosing","playerDestroyed","playerCreated","onReceivedCommand"]
  }

  @objc
  open override class func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(setAccessKey:)
  func setAccessKey(_ accessKey: String) {
    DispatchQueue.main.async {
      ShopLive.configure(with: accessKey)
    }
  }
  @objc(play:)
  func play(campaign: String) {
    DispatchQueue.main.async {
      ShopLive.play(data: .init(campaignKey:campaign))
    }
  }

  @objc(setUser:userName:)
  func setUser(_ userId: String, userName: String) {
    DispatchQueue.main.async {
      let user = ShopLiveCommonUser(
        userId : userId,
        name : userName
      )
      ShopLive.user = user
    }
  }
  
  @objc(setShareUrl:)
  func setShareUrl(_ schemeUrl: String) {
    DispatchQueue.main.async {
      //share api changed since v1.5.5
      // ShopLive.setShareScheme(schemeUrl, custom: nil)
      ShopLive.setShareScheme(schemeUrl, shareDelegate: nil)
    }
  }
  
 
  
  @objc(close)
  func close() {
    DispatchQueue.main.async {
      ShopLive.close()
    }
  }
}


class ShopLiveHandler: NSObject, ShopLiveSDKDelegate {
  
  var emitter: RCTEventEmitter!
  init(_ emitter: RCTEventEmitter) {
    super.init()
    self.emitter = emitter
  }
  
  func handleNavigation(with url: URL) {
    print("handle Navigation fired")
    DispatchQueue.global(qos: .background).async {
      self.emitter.sendEvent(withName: "handleNavigation", body: ["url" : url.absoluteString])
    }
    
  }
  
  func handleError(code: String, message: String) {
    DispatchQueue.global(qos: .background).async {
      self.emitter.sendEvent(withName: "onError", body: ["code" : code, "message" : message])
    }
  }
  
  
  func handleDownloadCoupon(with couponId: String, result: @escaping (ShopLiveCouponResult) -> Void) {
    DispatchQueue.global(qos: .background).async {
      self.emitter.sendEvent(withName: "downloadCoupon", body: ["couponId" : couponId])
    }
  }
  
  func handleCustomAction(with id: String, type: String, payload: Any?, result: @escaping (ShopLiveCustomActionResult) -> Void) {
    DispatchQueue.global(qos: .background).async {
      self.emitter.sendEvent(withName: "customAction", body: ["id" : id, "type" : type, "payload" : payload])
    }
  }
  
  func handleChangeCampaignStatus(status: String) {
    
  }
  
  func handleCampaignInfo(campaignInfo: [String : Any]) {
    
  }
  
  func handleCommand(_ command: String, with payload: Any?) {
    if command == "didShopLiveOn" {
      self.emitter.sendEvent(withName: "playerCreated", body: ["message": "didShopLiveOn"])
    }
    else if command == "didShopLiveOff" {
      self.emitter.sendEvent(withName: "playerDestroyed", body: ["message": "playerDestroyed"])
    }
    else if command == "willShopLiveOff" {
      self.emitter.sendEvent(withName: "playerClosing", body: ["message": "playerClosing"])
    }
  }
  
  func onSetUserName(_ payload: [String : Any]) {
    
  }
  
  func handleReceivedCommand(_ command: String, with payload: Any?) {
    var payloadString = ""

        if let payload = payload {
            do {
                let data = try JSONSerialization.data(withJSONObject: payload, options: [])
                payloadString = String(data: data, encoding: .utf8) ?? "Invalid payload"
            } catch {
                print("Error converting payload to JSON string: \(error)")
                payloadString = "Error"
            }
        }

        self.emitter.sendEvent(withName: "onReceivedCommand", body: ["command": command, "data": payloadString])
    

  }
  
  

  
  
}

