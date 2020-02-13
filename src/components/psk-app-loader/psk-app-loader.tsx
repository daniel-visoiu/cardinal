import {Component, Prop, State, Element} from '@stencil/core';
import ControllerFactory from "../../services/ControllerFactory";

@Component({
  tag: 'psk-app-loader',
  shadow: true
})
export class PskAppLoader {
  @Prop() controllerName: any;
  @State() htmlLoader: HTMLElement;
  @State() appIsAvailable = false;
  @Element() host;

  private controller;

  static __createLoader() {

    const NR_CIRCLES = 12;
    let circles = "";

    for (let i = 1; i <= NR_CIRCLES; i++) {
      circles += `<div class="sk-circle${i} sk-circle"></div>`
    }

    let node = document.createElement("div");
    node.className = "app-loader";
    node.innerHTML = `<div class='sk-fading-circle'>${circles}</div>`;
    return node;
  }

  constructor() {
    this.htmlLoader = PskAppLoader.__createLoader();
    document.getElementsByTagName("body")[0].appendChild(this.htmlLoader);


  }

  componentWillLoad() {
    return new Promise((resolve, reject) => {
      if (this.controllerName) {
        ControllerFactory.getController(this.controllerName).then((Ctrl) => {
          this.controller = new Ctrl(this.host);
          this.controller.checkApp((app) => {
            if (app) {
              this.appIsAvailable = true;
            }
            resolve();
          })
        }).catch(error => {
          reject(error);
        })
      } else {
        reject("A controller is mandatory!");
      }
    })
  }

  componentDidLoad() {
    document.getElementsByTagName("body")[0].removeChild(this.htmlLoader);
  }

  render() {
  }
}
