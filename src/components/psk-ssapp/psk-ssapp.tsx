import {Component, h, Prop, State, Element, Watch} from '@stencil/core';
import {TableOfContentProperty} from '../../decorators/TableOfContentProperty';
import {MatchResults, RouterHistory} from "@stencil/router";
import {BindModel} from "../../decorators/BindModel";
import CustomTheme from "../../decorators/CustomTheme";
import SSAppInstanceRegistry from "./SSAppInstancesRegistry.js";
import NavigatinTrackerService from "./NavigationTrackerService.js";
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

  @TableOfContentProperty({
    isMandatory: false,
    description: `This property keeps should have 2 keys: currentDossierPath and fullPath`,
    propertyType: 'string'
  })
  @Prop() dossierContext: any = null;

  @State() digestSeedHex;
  @Element() element;

  private seed;
  private applicationName;
  private eventHandler;
  private componentInitialized = false;

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

    if(this.componentInitialized){
      this.getAppSeed((err, seed) => {
        if (err) {
          throw err;
        }
        this.seed = seed;

        this.digestSeedHex = this.digestMessage(seed);
        NavigatinTrackerService.getInstance().setIdentity(this.digestSeedHex);
        if (typeof callback === "function") {
          callback();
        }
      })
    }
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
    let iframe = this.element.querySelector("iframe");
    console.log("#### Trying to register ssapp reference");
    SSAppInstanceRegistry.getInstance().addSSAppReference(this.applicationName, iframe);

    this.eventHandler = this.ssappEventHandler.bind(this);
    window.document.addEventListener(this.digestSeedHex, this.eventHandler);
    NavigatinTrackerService.getInstance().listenForSSAppHistoryChanges();
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


  getManifest(manifestUrl, callback) {
    fetch(manifestUrl).then((response) => {
      response.text().then(data => {
        callback(undefined, JSON.parse(data));
      }).catch((err) => {
        callback(err);
      })
    });
  }

  getAppSeed(callback) {

    let manifestUrl = "/download";
    let mountingPoint = APPS_FOLDER;
    if (this.dossierContext && this.dossierContext.fullPath && this.dossierContext.currentDossierPath) {
      manifestUrl += `${this.dossierContext.currentDossierPath}`;

      if(manifestUrl.endsWith("/")){
        manifestUrl = manifestUrl.substr(0, manifestUrl.lastIndexOf("/"));
      }

      if (this.dossierContext.currentDossierPath !== "/") {
        mountingPoint = this.dossierContext.fullPath.replace(this.dossierContext.currentDossierPath, "");
      } else {
        mountingPoint = this.dossierContext.fullPath;
      }

    }
    manifestUrl+="/manifest";


    this.getManifest(manifestUrl, (err, manifest) => {
      if (err) {
        throw err;
      }
      if (manifest.mounts) {
        for (let mount in manifest.mounts) {
          if (mount === mountingPoint + "/" + this.applicationName) {
            return callback(undefined, manifest.mounts[mount]);
          }
        }
      }
      callback(new Error("No seed for app " + this.applicationName));
    })
  }

  componentWillLoad(): Promise<any> {
    return new Promise((resolve) => {
      this.componentInitialized = true;
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

    let basePath;
    let parentWindow = window.parent;
    let currentWindow = window;

    try{
      while(currentWindow !== parentWindow){
        basePath = parentWindow.location.href;
        // @ts-ignore
        currentWindow = parentWindow;
        parentWindow = parentWindow.parent;
      }

    }
    catch (e) {

    }
    finally {
      basePath = currentWindow.location.href;
      if (basePath[basePath.length - 1] !== '/') {
        basePath += '/';
      }

      const iframeSrc = basePath + "iframe/" + this.digestSeedHex;
      return (
        <iframe
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
}
