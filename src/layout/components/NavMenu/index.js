
// import $ from 'jquery/dist/jquery.min.js'
// import jqueryJson from "jquery-json"
// // import verto from "verto"
// require("../../../assets/js/jquery.json-2.4.min.js")
// require("../../../assets/js/verto-min.js")
// import vertos from "@/assets/js/verto-min.js"
export default class vertoCell {

  // var vertoHandle, vertoCallbacks, currentCall;
  constructor() {
    this.vertoHandle = null
    this.currentCall = null
    this.vertoCallbacks = {
      onWSLogin: this.onWSLogin(),
      onWSClose: this.onWSClose(),
      onDialogState: this.onDialogState(),
    }
  }

  initTell(login, passwd, url, prot) {
    console.log($.vertos,'===========$.vertos')
    console.log(1111213123)
    if (login && passwd && url && prot) {
      vertos.init({}, this.bootstrap(login, passwd, url, prot));
    }
  }

  bootstrap(login, passwd, url, prot) {
    this.vertoHandle = $.verto({
      login: `${login}@${url}`,
      passwd: passwd,
      // As configured in verto.conf.xml on the server.
      socketUrl: `wss://${url}:${prot}`,
      // TODO: Where is this file, on the server? What is the base path?
      ringFile: './sounds/bell_ring2.wav',
      // STUN/TURN server config, more than one is allowed.
      // Instead of an array of objects, you can also pass a Boolean value,
      // false disables STUN, true uses the default Google STUN servers.
      // deviceParams: {
      //   useMic: true,
      //   useSpeak: true
      // },
      iceServers: true,
      deviceParams: {
        useMic: true,
        useSpeak: true,
        useCamera: true,
        // // Set to 'none' to disable outbound audio.
        // useMic: 'any',
        // // Set to 'none' to disable inbound audio.
        // useSpeak: 'any',
        // // Set to 'none' to disable outbound video.
        // useCamera: 'any',
      },
      // tag: "video-container",
    }, this.vertoCallbacks);
  };

  makeCall(destinationNumber) {

    this.currentCall = this.vertoHandle.newCall({
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


  onDialogState(dialog) {
    console.debug('onDialogState', dialog);
    console.log(dialog, '------')
    if (dialog) {
      this.currentCall = dialog;

      if (dialog.state.name == 'ringing') {
        alert('Someone is calling you, answer!');
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
    }

  };

  hangupCall() {
    console.log('挂断')
    // currentCall.hangup();
    this.vertoHandle.hangup();
    this.currentCall = null;
  };
  answerCall() {
    console.log('接听')
    this.currentCall.answer();
  };
  muteCall() {
    this.currentCall.mute("off");
  };

  unmuteCall() {
    this.currentCall.mute("on");
  };

  muteUnmuteCall() {
    this.currentCall.mute("toggle");
  };

  holdCall() {
    this.currentCall.hold();
  };

  unholdCall() {
    this.currentCall.unhold();
  };

  transferCall() {
    // Insert transfer destination number:  prompt("")
    var destinationNumber = prompt("2005");
    if (destinationNumber) {
      this.currentCall.transfer(destinationNumber);
    }
  };

  onWSLogin(verto, success) {
    console.log('onWSLogin', success);
  };

  onWSClose(verto, success) {
    console.log('onWSClose', success);
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
}


// export default new vertoCell();
