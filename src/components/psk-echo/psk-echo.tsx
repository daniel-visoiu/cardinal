import { Component, Prop } from '@stencil/core';
import { BindModel } from "../../decorators/BindModel";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-echo'
})

export class PskEcho {
  @BindModel() modelHandler;

  @TableOfContentProperty({
    description: `This property is a string that will permit the developer to print a bound value from controller.`,
    propertyType: `string | null`,
    isMandatory: true,
    defaultValue: `null`
  })
  @Prop() value: string | null = null;

  render() {
    return (this.value ? this.value : null);
  }
}
