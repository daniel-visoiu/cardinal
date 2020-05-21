import {Component, h, Prop,} from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import {BindModel} from '../../decorators/BindModel';

@Component({
  tag: 'psk-user-profile-renderer',
  styleUrl:"../../../themes/commons/bootstrap/css/bootstrap.css",
  shadow: true
})
export class PskUserProfileRenderer {

  @BindModel() modelHandler;
  @CustomTheme()
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

