import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'psk-ss-app',
})

export class PskSelfSovereignApp {

  @Prop() iframeSrc:string;
  @Prop () swPath:string;
  @Prop() appName:string;

  componentDidLoad(){
    let  folderName = "/" + this.appName + "/";
    navigator.serviceWorker.register(this.swPath, {scope: folderName})
      .then(function (registration) {
          console.log('registration with scope: ', registration.scope);
        },
        function (err) { // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
  }

  render() {
    return (
      <iframe width="100%" height="600px" src={this.iframeSrc}/>
  )
  }
}
