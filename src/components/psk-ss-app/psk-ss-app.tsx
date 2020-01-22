import {Component, h, Prop, State, Element} from '@stencil/core';

@Component({
  tag: 'psk-ss-app',
  shadow: false
})

export class PskSelfSovereignApp {

  @Prop() iframeSrc: string;
  @Prop() swPath: string;
  @Prop() appName: string;
  @Prop() csbSeed: string;
  @State() digestSeedHex;
  @Element() element;


  async componentWillLoad() {
    this.digestSeedHex = this.digestMessage(this.csbSeed);
  }

  componentDidLoad() {
    let newIframe = this.element.querySelector("iframe");

    // @ts-ignore
    window.IframeCommunicationInstance.initializeSwarmEngine(this.digestSeedHex, newIframe);
    //TODO remove this test
    setTimeout(() => {
      this.sendMessageToIframe(this.digestSeedHex, "Hi there " + this.digestSeedHex);
    }, 1000);
  }

  sendMessageToIframe(identity, message) {
      // @ts-ignore
      $$.interactions.startSwarmAs(identity, "echo", "say", message)
        .onReturn(function (err, result) {
          if (!err) {
            console.log("Iframe received: ", result);
            //ping-pong
            //sayEcho(result+"!");
          } else {
            console.log(err);
          }
        });
    }

   digestMessage(message) {
    // @ts-ignore
    const PskCrypto = require("pskcrypto");
    const hexDigest = PskCrypto.pskHash(message, "hex");
    return hexDigest;
  }


  render() {

    if (!this.digestSeedHex) {
      return null;
    }

    let iframeSrc = "/SSApps/app/" + this.digestSeedHex + "/index.html?" + this.digestSeedHex;
    return (
      <iframe sandbox="allow-scripts allow-same-origin allow-downloads-without-user-activation allow-forms"
              width="300px" height="300px" src={iframeSrc}/>
    )
  }
}
