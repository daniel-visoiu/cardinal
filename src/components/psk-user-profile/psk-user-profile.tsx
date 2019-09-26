import {Component, h,  EventEmitter, Event, Prop,} from '@stencil/core';

@Component({
  tag: 'psk-user-profile',
  shadow: true
})
export class PskUserProfile {
  @Prop() userInfo: any = null;
  @Prop() profileRenderer:any;

  @Event({
    eventName: 'getUserInfo',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getUserInfoEvent: EventEmitter;

  componentWillLoad() {
    if (!this.userInfo) {
      this.getUserInfoEvent.emit((err, userInfo) => {
        if (!err) {
          this.userInfo = userInfo;
        } else {
          console.error("Error getting user info", err);
        }
      })
    }
  }

  render() {

    let ItemRenderer = this.profileRenderer?this.profileRenderer:"psk-user-profile-renderer";

    return (
      <ItemRenderer userInfo={this.userInfo}/>
    );
  }
}

