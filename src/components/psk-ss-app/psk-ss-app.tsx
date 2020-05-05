import {Component, h, Prop, State, Event, EventEmitter, Element} from '@stencil/core';

@Component({
  tag: 'psk-ss-app',
  shadow: false
})

export class PskSelfSovereignApp {

  @Prop() iframeSrc: string;
  @Prop() appName: string;
  @Prop() landingPath: string;
  @Prop() csbSeed: string;
  @State() digestSeedHex;
  @State() seed;
  @Element() element;

  @Event({
    eventName: 'giveMeSeed',
    composed: true,
    cancelable: true,
  }) giveMeSeed: EventEmitter;

  onServiceWorkerMessageHandler: (e) => void;

  componentDidLoad(){
    let iframe = this.element.querySelector("iframe");
    window.document.addEventListener(this.digestSeedHex, (e) => {
      const data = e.detail || {};

      if (data.query === 'seed') {
        iframe.contentWindow.document.dispatchEvent(new CustomEvent(this.digestSeedHex, {
          detail: {
            seed: this.seed
          }
        }));
        return;
      }

      if (data.status === 'completed') {
        if(typeof this.landingPath !== "undefined"){
          iframe.contentWindow.location = this.landingPath;
        }else{
          iframe.contentWindow.location.reload();
        }

        return;
      }
    }, true);
  }

  getSWOnMessageHandler() {
    if (this.onServiceWorkerMessageHandler) {
      return this.onServiceWorkerMessageHandler;
    }

    /**
     * Listen for seed requests
     */
    this.onServiceWorkerMessageHandler = (e) => {
      if (!e.data || e.data.query !== 'seed') {
        return;
      }

      const swWorkerIdentity = e.data.identity;
      if (swWorkerIdentity === this.digestSeedHex) {
        e.source.postMessage({
          seed: this.seed
        });
      }
    }
    return this.onServiceWorkerMessageHandler;
  }

  connectedCallback() {
    navigator.serviceWorker.addEventListener('message', this.getSWOnMessageHandler());
  }

  disconnectedCallback() {
    navigator.serviceWorker.removeEventListener('message', this.getSWOnMessageHandler());
  }


  componentWillLoad() {
    return new Promise((resolve)=>{
      this.giveMeSeed.emit({appName:this.appName, callback:(err, seed)=>{
        if(err){
          throw err;
        }
        this.seed = seed;
        this.digestSeedHex = this.digestMessage(seed);

        resolve();
      }})
    });
  }

  // componentDidLoad() {
  //   //let newIframe = this.element.querySelector("iframe");
  //
  //   //TODO: this code should be moved to a separate controller
  //   // @ts-ignore
  //   // const BootLoader = require("boot-host").getBootScriptLoader();
  //   // BootLoader.createPowerCord(this.digestSeedHex, this.csbSeed, newIframe);
  //   // //TODO remove this test
  //   // setTimeout(() => {
  //   //   this.sendMessageToIframe(this.digestSeedHex, "Hi there " + this.digestSeedHex);
  //   // }, 1000);
  // }

  sendMessageToIframe(identity, message) {

    let sayEcho =  (message)=>{
      // @ts-ignore
      $$.interactions.startSwarmAs(identity, "echo", "say", message)
        .onReturn(function (err, result) {
          if (!err) {
            console.log("Iframe received: ", result);
            //ping-pong
            setTimeout(()=>{
              //sayEcho(result+"!");
            },10000)
          } else {
            console.log(err);
          }
        });
    };

    sayEcho(message);


    }

   digestMessage(message) {
    // @ts-ignore
    const PskCrypto = require("pskcrypto");
    const hexDigest = PskCrypto.pskHash(message, "hex");
    return hexDigest;
  }


  render() {
    let basePath = window.top.location.href;
    if (basePath[basePath.length - 1] !== '/') {
        basePath += '/';
    }

    const iframeSrc = basePath + "iframe/" + this.digestSeedHex;
    return (
      <iframe sandbox="allow-scripts allow-same-origin allow-forms"
        frameborder="0"
        style={{
          overflow: "hidden",
          height: "100%",
          width: "100%"
        }}
        src={iframeSrc}/>
    )
  }
}
