import {Component, h, State, EventEmitter, Event, Prop,} from '@stencil/core';

@Component({
  tag: 'psk-user-profile',
  shadow: true
})
export class PskUserProfile {
  @State() userInfo: any;
  @Prop() itemRenderer:any;

  @Event({
    eventName: 'getUserInfo',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getUserInfoEvent: EventEmitter;

  componentWillLoad() {
    this.getUserInfoEvent.emit((err, userInfo)=>{
      if(!err){
        this.userInfo = userInfo;
      }
      else{
        console.error("Error getting user info",err);
      }
    })
  }

  render() {

    let ItemRenderer = this.itemRenderer?this.itemRenderer:"psk-user-profile-renderer";

    return (
      <ItemRenderer userInfo={this.userInfo}/>
    );
  }
}

