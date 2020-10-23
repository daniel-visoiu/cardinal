import { Component, Prop, Element, h } from "@stencil/core";

import CustomTheme from "../../decorators/CustomTheme";
import { BindModel } from "../../decorators/BindModel";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

import { dispatchEvent } from "../../events/helpers";

@Component({
  tag: "psk-button-link",
  styleUrl: './psk-button-link.css',
  shadow: true
})

export class PskButtonLink {
  @CustomTheme()

  @BindModel() modelHandler;

  @Element() private __host;

  @TableOfContentProperty({
    description: `This property is passed to psk-link.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() page: string;

  @TableOfContentProperty({
    description: [
      `This property is the label for this component.`,
      `If this property is not specified, you must provide a slot as content for the label of this component`
    ],
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() name?: string;

  @TableOfContentProperty({
    description: `This property describes the icon specified for psk-icon.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() icon?: string;

  @TableOfContentProperty({
    description: [
      `By defining this attribute, the component will be able to trigger an event.`
    ],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() eventName: string | null;

  @TableOfContentProperty({
    description: [
      `This attribute is used to pass some information along with an event.`,
      `This attribute is taken into consideration only if the event-name has a value. If not, it is ignored.`
    ],
    isMandatory: false,
    propertyType: 'any'
  })
  @Prop() eventData: any | null;

  @TableOfContentProperty({
    description: [
      `This attribute is telling the component where to trigger the event. Accepted values: "document, "window".`,
      `If the value is not set or it is not one of the accepted values, the event-dispatcher will be the component itself.`
    ],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() eventDispatcher: string | null;

  handleClick() {
    dispatchEvent(this.__host, {
      eventName: this.eventName,
      eventData: this.eventData,
      eventDispatcher: this.eventDispatcher
    });
  }

  render() {
    const className = { 'button-link': true };
    if (this.__host.className) { className[this.__host.className] = true; }

    return (
      <psk-link page={this.page} class={className} onClick={this.handleClick.bind(this)}>
        {this.icon ? <psk-icon icon={this.icon}/> : null}
        {this.name ? <div>{this.name}</div> : <slot/>}
      </psk-link>
    )
  }
}
