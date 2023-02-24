import { Descriptions } from 'element-ui';
import store from '../../../store'
require("../../../assets/js/verto-min.js")


export var vertoHandle, vertoCallbacks, currentCall;

// put your code here!
//配置初始化
export function init(login, passwd, url, prot = "8082") {
  vertoHandle = null
  currentCall = null
  if (login && passwd && url && prot) {
    console.log(login, passwd, url, prot,'坐席初始化配置数据')
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
      useCamera: 'none',
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
  store.commit('setInfo', { login,passwd,url })
  // store.commit('IsLogin', true)
};

//登录
export function login(login, passwd, url) {
  console.log("初始化登录！")
  vertoHandle.loginData({
    login: `${login}@${url}`,
    passwd: `${passwd}`
  });
  vertoHandle.login();
  // ext,extPwd,extUrl,extPort
  store.commit('setInfo', { login,passwd,url })
  // store.commit('setInfo', { ext:login, extPwd:passwd,extUrl:url })
}
//退出
export function logout() {
  vertoHandle.logout();
  store.commit('setInfo', { })
}
//拨打电话
export function makeCall(destinationNumber) {

  currentCall = vertoHandle.newCall({
    destination_number: destinationNumber,
    caller_id_name: "JVTD",
    caller_id_number: store.state.info.login,
    outgoingBandwidth: "default",
    incomingBandwidth: "default",
    useStereo: true,
    useVideo: true,
    useMic: "any",
    useSpeak: "any",
    useCamera: 'none',
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
  currentCall = dialog;
  store.commit('vertoState', dialog.state.name)
  if (dialog.state.name == 'ringing') {

    console.log('有人在呼叫你，快接!');
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
    useCamera: 'none',

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
  var destinationNumber = prompt("请输入转接号码");
  console.log(destinationNumber,'---------destinationNumber')
  if (destinationNumber) {
    currentCall.transfer(destinationNumber);
  }
};

export function onWSLogin(verto, success) {
  console.log('onWSLogin', success);
  if (success){
    store.commit('IsLogin', success)
    console.log("分机登录成功~")
  }
  
};

function onWSClose(verto, success) {
  console.log('onWSClose', success);
  if (success) {
    store.commit('IsLogout', success)
    store.commit('IsLogin', false)
    console.log("分机退出成功~")
  }
  
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


