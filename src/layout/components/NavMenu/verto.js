import store from '../../../store'
require("../../../assets/js/verto-min.js")


export var vertoHandle, vertoCallbacks, currentCall;

// put your code here!
//配置初始化
export function init(login, passwd, url, prot = "8082") {
  vertoHandle = null
  currentCall = null
  if (login && passwd && url && prot) {
    $.verto.init({}, bootstrap(login, passwd, url, prot));
    
  }
}


function bootstrap(login, passwd, url, prot) {
  vertoHandle = new $.verto({
    login: `${login}@${url}`,
    passwd: passwd,
    // As configured in verto.conf.xml on the server.
    socketUrl: `wss://${url}:${prot}`,
    // TODO: Where is this file, on the server? What is the base path?
    ringFile: 'sounds/bell_ring2.wav',
    iceServers: true,

    wsFallbackURL: null,
    turnServer: null,
    // sessid:'',
    deviceParams: {
      // Set to 'none' to disable outbound audio.
      useMic: 'any',
      // Set to 'none' to disable inbound audio.
      useSpeak: 'any',
      // Set to 'none' to disable outbound video.
      useCamera: 'any',
      onResCheck: null
    },
    audioParams: {
      googAutoGainControl: false,
      googNoiseSuppression: false,
      googHighpassFilter: false
    },
    videoParams: {
      "minWidth": 320,
      "minHeight": 180,
      "maxWidth": 320,
      "maxHeight": 180,
      "minFrameRate": 15,
      "vertoBestFrameRate": 30
    },
    tag: "webcam",
  }, vertoCallbacks);
  vertoHandle.loginData({
    login: `${login}@${url}`,
    passwd: `${passwd}`
  });
  vertoHandle.login();
};

//登录
export function login(login, passwd, url) {
  vertoHandle.loginData({
    login: `${login}@${url}`,
    passwd: `${passwd}`
  });
  vertoHandle.login();
  // ext,extPwd,extUrl,extPort
  // store.commit('setInfo', { ext:login, extPwd:passwd,extUrl:url })
}
//退出
export function logout() {
  vertoHandle.logout();
  // store.commit('setInfo', { })
}
//拨打电话
export function makeCall(destinationNumber) {

  currentCall = vertoHandle.newCall({
    destination_number: destinationNumber,
    caller_id_name: "Test Guy1111",
    caller_id_number: store.state.info.login,
    outgoingBandwidth: "default",
    incomingBandwidth: "default",
    useStereo: true,
    useVideo: true,
    useMic: "any",
    useSpeak: "any",
    useCamera: 'any',
    screenShare: false,
    // deviceParams:{
    //   useMic: 'any',
    //   useSpeak: 'any',
    //   useCamera: 'any',
    // },
    dedEnc: false,
    mirrorInput: false,
    // userVariables: {
    //   avatar: "",
    //   email: "test@test.com"
    // },
  });
};

function onDialogState(dialog) {
  console.debug('onDialogState', dialog);
  console.log(dialog, '------')
  currentCall = dialog;
  store.commit('vertoState', dialog.state.name)
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
      currentCall.setMute("on")
      console.log('正在通话-----active')
      // vertoHandle.subscribe("presence", {
      //   handler: function (v, e) {
      //     if (e.data.channelUUID === master && e.data.channelCallState === "HANGUP") {
      //       currentCall.hangup();
      //     }
      //   }
      // });
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
  currentCall.answer({

    callee_id_name: "Test Guy",
    callee_id_number: store.state.info.login,
    useVideo: true,
    useStereo: true,
    useMic: 'any',
    useSpeak: 'any',
    useCamera: 'any',

  });
};
export function muteCall() {
  currentCall.setmute();
};

export function unmuteCall() {
  currentCall.getmute();
};

export function muteUnmuteCall() {
  currentCall.setMute("toggle")
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
  if (destinationNumber) {
    currentCall.transfer(destinationNumber);
  }
};

export function onWSLogin(verto, success) {
  console.log('onWSLogin', success);
  store.commit('IsLogin', success)
};

function onWSClose(verto, success) {
  console.log('onWSClose', success);
  store.commit('IsLogout', success)
  store.commit('IsLogin', false)
};


// Receives call state messages from FreeSWITCH.
//电话记录
// function. onDialogState(d) {
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
  onMessage: function (verto, dialog, msg, data) {
    
    console.log(verto, dialog, msg, data, '======onMessage')
    // verto.eventSUBS.presence = []
  }
};


