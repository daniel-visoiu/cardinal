import {Component, h, Prop, State, Element, Watch} from '@stencil/core';
import {TableOfContentProperty} from '../../decorators/TableOfContentProperty';
import {MatchResults, RouterHistory} from "@stencil/router";
import {BindModel} from "../../decorators/BindModel";
import CustomTheme from "../../decorators/CustomTheme";

const APPS_FOLDER = "/apps";

@Component({
  tag: 'psk-ssapp',
  shadow: false
})

export class PskSelfSovereignApp {

  @BindModel() modelHandler;

  @CustomTheme()

  @TableOfContentProperty({
    isMandatory: true,
    description: [`This property represents the name of the Self Sovereign Application that you want to run.`],
    propertyType: 'string'
  })
  @Prop() appName: string;


  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @TableOfContentProperty({
    isMandatory: true,
    description: `This property represents the direct path that will be passed to the Iframe as the landing-page property.`,
    propertyType: 'string'
  })
  @Prop() landingPath: string;
  @State() digestSeedHex;
  @Element() element;

  private seed;
  private applicationName;
  private eventHandler;

  onServiceWorkerMessageHandler: (e) => void;

  hasRelevantMatchParams() {
    return this.match && this.match.params && this.match.params.appName;
  }

  @Watch("appName")
  @Watch("match")
  loadApp(callback?) {

    if (this.hasRelevantMatchParams()) {
      this.applicationName = this.match.params.appName;
    }
    else {
      this.applicationName = this.appName;
    }


    this.getAppSeed((err, seed) => {
      if (err) {
        throw err;
      }
      this.seed = seed;

      this.digestSeedHex = this.digestMessage(seed);
      if (typeof callback === "function") {
        callback();
      }
    })
  };

  componentShouldUpdate(newValue, oldValue, changedState) {
    if (newValue !== oldValue && changedState === "digestSeedHex") {
      window.document.removeEventListener(oldValue, this.eventHandler);
      window.document.addEventListener(newValue, this.eventHandler);
      return true;
    }
    return false;
  }


  ssappEventHandler(e) {

    const data = e.detail || {};
   let iframe = this.element.querySelector("iframe");

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
  }

  componentDidLoad() {
    this.eventHandler = this.ssappEventHandler.bind(this);
    window.document.addEventListener(this.digestSeedHex, this.eventHandler);
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


  getManifest(callback) {
    fetch("/download/manifest").then((response) => {
      response.text().then(data => {
        callback(undefined, JSON.parse(data));
      }).catch((err) => {
        callback(err);
      })
    });
  }

  getAppSeed(callback) {
    this.getManifest((err, manifest) => {
      if (err) {
        throw err;
      }
      if (manifest.mounts) {
        for (let mount in manifest.mounts) {
          if (mount === APPS_FOLDER + "/" + this.applicationName) {
            return callback(undefined, manifest.mounts[mount]);
          }
        }
      }
      callback(new Error("No seed for app " + this.applicationName));
    })
  }

  componentWillLoad(): Promise<any> {
    return new Promise((resolve) => {
      this.loadApp(resolve)
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
