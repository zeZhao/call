// import $ from 'jquery/dist/jquery.min.js'
// require("../../../assets/js/jquery-2.1.1.min.js")
// require("../../../assets/js/jquery.json-2.4.min.js")
require("../../../assets/js/verto-min.js")




 export var vertoHandle, vertoCallbacks, currentCall;
  let IsLogin = false
  let IsLogout = false


  // put your code here!
  //配置初始化
  export function init(login,passwd,url,prot="8082"){
    if(login && passwd && url && prot){
      $.verto.init({}, bootstrap(login,passwd,url,prot));
    }
  }
  

  function bootstrap(login,passwd,url,prot) {
    vertoHandle = new jQuery.verto({
      login: `${login}@${url}`,
      passwd: passwd,
      // As configured in verto.conf.xml on the server.
      socketUrl: `wss://${url}:${prot}`,
      // TODO: Where is this file, on the server? What is the base path?
      ringFile: './sounds/bell_ring2.wav',
      iceServers: true,
      deviceParams: {
        useMic: true,
        useSpeak: true,
        useCamera: true,
      },
      // tag: "video-container",
    }, vertoCallbacks);
  };

  //登录
  export function login(login,passwd,url){
    vertoHandle.loginData({
			login: `${login}@${url}`,
			passwd: `${passwd}`
		});
		vertoHandle.login();
  }
  //退出
  export function logout(){
		vertoHandle.logout();
  }
  //拨打电话
  export function makeCall(destinationNumber) {

    currentCall = vertoHandle.newCall({
      destination_number: destinationNumber,
      caller_id_name: "Test Guy",
      caller_id_number: "2004",
      outgoingBandwidth: "default",
      incomingBandwidth: "default",
      useStereo: true,
      useMic: true,
      useSpeak: true,
      useCamera: true,
      useVideo: true,
      dedEnc: false,
      mirrorInput: false,

      userVariables: {
        avatar: "",
        email: "test@test.com"
      },
    });
  };

  function onDialogState(dialog) {
    console.debug('onDialogState', dialog);
    console.log(dialog, '------')
    currentCall = dialog;

    if (dialog.state.name == 'ringing') {
      alert('有人在呼叫你，快接!');
    }
    switch (dialog.state.name) {
      case "trying":
        console.log('请求呼叫-----trying')
        break;
      case "answering":
        console.log('请求应答-----answering')
        break;
      case "active":
        console.log('正在通话-----active')
        break;
      case "hangup":
        console.log('暂停-----hangup')
        break;
      case "destroy":
        console.log('挂断-----destroy')
        // Some kind of client side cleanup...
        break;
    }
  };

  export function hangupCall() {
    console.log('挂断')
    // currentCall.hangup();
    vertoHandle.hangup();
    currentCall = null;
  };
  export function answerCall() {
    console.log('接听')
    currentCall.answer();
  };
  export function muteCall() {
    currentCall.setmute();
  };
  
  export function unmuteCall() {
    currentCall.getmute();
  };
  
  export function muteUnmuteCall() {
    currentCall.mute("toggle");
  };

  export function holdCall() {
    currentCall.hold();
  };
  
  export function unholdCall() {
    currentCall.unhold();
  };

  export function transferCall() {
    // Insert transfer destination number:  prompt("")
    var destinationNumber = prompt("2005");
    if(destinationNumber) {
      currentCall.transfer(destinationNumber);
    }
  };

  export function onWSLogin(verto, success) {
    IsLogin = success
    console.log('onWSLogin', success);
    return success
  };

  function onWSClose(verto, success) {
    IsLogout = success
    console.log('onWSClose', success);
    return success
  };
  

  // Receives call state messages from FreeSWITCH.
  //电话记录
  // function onDialogState(d) {
  //   switch (d.state.name) {
  //     case "trying":
  //       break;
  //     case "answering":
  //       break;
  //     case "active":
  //       break;
  //     case "hangup":
  //       log("Call ended with cause: " + d.cause);
  //       break;
  //     case "destroy":
  //       // Some kind of client side cleanup...
  //       break;
  //   }
  // }

  vertoCallbacks = {
    onWSLogin: onWSLogin,
    onWSClose: onWSClose,
    onDialogState: onDialogState,
  };
  export const a = IsLogin
  export const b = IsLogout


  