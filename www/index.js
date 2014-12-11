    function successHandler (result) {
      // alert('result = ' + result);
    }
    function errorHandler (error) {
      // alert('error = ' + error);
    }
    function sendMessageToPlatform(message) {
      // alert("sendMessageToPlatform:" + JSON.stringify(message));
      window.document.getElementById("platform_iframe").contentWindow.postMessage(
        message, "*");
    }
    function sendNotification(payload, error) {
      // alert("notifying the platform");
      sendMessageToPlatform({payload: payload, error: error});
    }
    function onDeviceReady() {
      facebookConnectPlugin.login(["public_profile"],
        fbLoginSuccess,
        function (error) { sendToken("", error); }
      );
    }
    
    function sendToken(token, error) {
      sendMessageToPlatform({token: token, error: error});
      registerForPushNotification();
    }
    function fbLoginSuccess(userData) {
      facebookConnectPlugin.getAccessToken(function(token) {
          sendToken(token, "");
      }, function(error) {
          sendToken("", error);
      });
    }
    function registerForPushNotification() {
      // alert("device is ready");
      var pushNotification = window.plugins.pushNotification;
      // alert(cordova.platformId);
      if ( cordova.platformId == 'android' || cordova.platformId == 'Android' || cordova.platformId == "amazon-fireos" ){
        pushNotification.register(
          successHandler,
          errorHandler,
          {
              "senderID":"800628973374",
              "ecb":"onNotification"
          });
        // alert("registration sent");
      } else {
        pushNotification.register(
          tokenHandler,
          errorHandler,
          {
              "badge":"true",
              "sound":"true",
              "alert":"true",
              "ecb":"onNotificationAPN"
          });
      }
    }
    // iOS
    function onNotificationAPN(event) {
      // alert('RECEIVED:' + JSON.stringify(event));
      if ( event.alert )
      {
          navigator.notification.alert(event.alert);
      }
      if ( event.sound )
      {
          var snd = new Media(event.sound);
          snd.play();
      }
      if ( event.badge )
      {
          pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
      }
    }
    function tokenHandler(result) {
      // Your iOS push server needs to know the token before it can push to this device
      // here is where you might want to send it the token for later use.
      // alert('device token = ' + result);
    }
    // Android and Amazon Fire OS
    function onNotification(e) {
      // alert('RECEIVED:' + JSON.stringify(e));
      switch( e.event )
      {
        case 'registered':
          if ( e.regid.length > 0 )
          {
            // Your GCM push server needs to know the regID before it can push to this device
            // alert('REGID:' + e.regid);
            window.regid = e.regid;
            sendNotification({regid: e.regid}, "");
            //save registration id
          }
        break;
        case 'message':
         // call function to handle e.payload
         sendNotification({notification: e.payload}, "");
        break;
        case 'error':
        //error?
        break;
      }
    }
    document.addEventListener("deviceready", onDeviceReady, false);
    window.addEventListener("message", function (event) {
      eval(event.data);
    });
