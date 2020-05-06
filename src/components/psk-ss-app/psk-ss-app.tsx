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

  componentDidLoad() {
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
        iframe.contentWindow.location.reload();
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
    };
    return this.onServiceWorkerMessageHandler;
  }

  connectedCallback() {
    navigator.serviceWorker.addEventListener('message', this.getSWOnMessageHandler());
  }

  disconnectedCallback() {
    navigator.serviceWorker.removeEventListener('message', this.getSWOnMessageHandler());
  }


  componentWillLoad() {
    return new Promise((resolve) => {
      this.giveMeSeed.emit({
        appName: this.appName, callback: (err, seed) => {
          if (err) {
            throw err;
          }
          this.seed = seed;
          this.digestSeedHex = this.digestMessage(seed);

          resolve();
        }
      })
    });
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
              landing-page={this.landingPath}
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
