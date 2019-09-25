import {Component, h, Prop,} from '@stencil/core';

@Component({
  tag: 'psk-user-profile-renderer',
  styleUrl: '../../themes/default/components/psk-user-profile/psk-user-profile.css',
  shadow: true
})
export class PskUserProfile {
  @Prop() userInfo:any;

  render() {
    return (
      <div class="profile">
        <div class="card-body text-center">
          <p><img class=" img-fluid" src={this.userInfo.avatar} alt="card image"/></p>
          <h5 class="card-title">{this.userInfo.username}</h5>
          <p class="card-text">{this.userInfo.email}</p>
        </div>
      </div>
    );
  }
}

