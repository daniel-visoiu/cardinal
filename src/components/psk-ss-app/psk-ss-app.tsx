import {Component, h, Prop, State, Event, EventEmitter, Element} from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';

@Component({
  tag: 'psk-ss-app',
  shadow: false
})

export class PskSelfSovereignApp {

  @TableOfContentProperty({
    isMandatory: true,
    description: [`This property represents the name of the Self Sovereign Application that you want to run.`,
    `Before the component is loaded it uses this property to emit the giveMeSeed event.`],
    propertyType: 'string'
  })
  @Prop() appName: string;

  @TableOfContentProperty({
    isMandatory: true,
    description: `This property represents the direct path that will be passed to the Iframe as the landing-page property.`,
    propertyType: 'string'
  })
  @Prop() landingPath: string;
  @State() digestSeedHex;
  @State() seed;
  @Element() element;

  @TableOfContentEvent({
    description: [`This event is emitted the right before the component is loaded in order the obtain the seed.`,
    `After this the seed is hashed using pskcrypto in order to be added in the iframe source.`]
  })
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
