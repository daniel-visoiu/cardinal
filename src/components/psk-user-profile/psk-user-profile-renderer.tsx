import {Component, h, Prop,} from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';

@Component({
  tag: 'psk-user-profile-renderer',
  styleUrl: '../../themes/default/components/psk-user-profile/psk-user-profile-renderer.css',
  shadow: true
})
export class PskUserProfile {
  @TableOfContentProperty({
    description: `This property is the user information that needs to be rendered for the user.`,
    isMandatory: false,
    propertyType: `any`
  })
  @Prop() userInfo:any;

  render() {
    return (
      <div class="profile">
        <div class="card-body text-center">
          <p><img src={this.userInfo.avatar} alt="card image"/></p>
          <h5 class="card-title">{this.userInfo.username}</h5>
          <p class="card-text">{this.userInfo.email}</p>
        </div>
      </div>
    );
  }
}

