import { Component, Prop, Element, Event, EventEmitter, h } from "@stencil/core";

import { BindModel } from "../../decorators/BindModel";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";
import PskButtonEvent from "../../events/PskButtonEvent";

@Component({
  tag: 'psk-modal',
  styleUrls: {
    default: './styles/psk-modal.default.css',
    layout: './styles/psk-modal.layout.css'
  },
  shadow: true
})

export class PskModal {
  @BindModel() modelHandler;

  @CustomTheme()

  @Element() private _host: HTMLElement;

  @TableOfContentProperty({
    description: `This is the property that gives the state of the modal if it is opened or closed.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop({ reflect: true, mutable: true }) opened: boolean = false;

  @TableOfContentProperty({
    description: `By defining this attribute, the component will be able to expose the functionality to expand and collapse the modal.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop({ reflect: true, mutable: true }) expanded: boolean = false;

  @TableOfContentProperty({
    description: `By defining this attribute, the component will be able to trigger an event. The name of the event is the value of the attribute.`,
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() eventName: string | null;

  @TableOfContentEvent({
    eventName: `closeModal`,
    description: `When this event is triggered the Application Controller should listen to this so the modal can be closed within the controller.`
  })
  @Event({
    eventName: 'closeModal',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) closeModal: EventEmitter;

  __closeModalHandler = (evt: MouseEvent) => {
    if (this.eventName) {
      evt.preventDefault();
      evt.stopImmediatePropagation();

      let pskButtonEvent = new PskButtonEvent(this.eventName, null, {
        bubbles: true,
        composed: true,
        cancelable: true
      });

      this._host.dispatchEvent(pskButtonEvent);
    } else {
      this.closeModal.emit();
    }
  }

  __expandModalHandler = (evt: MouseEvent) => {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.expanded = !this.expanded;
  }

  render() {
    const expandCollapseIcon = (
      <button class='expand' onClick={this.__expandModalHandler}>
        <psk-icon class='expand-icon' icon={this.expanded ? 'compress' : 'expand'}/>
      </button>
    )

    return [
      <div class="psk-modal-backdrop" onClick={this.__closeModalHandler} />,
      <div class="psk-modal">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="title" />
            <div class='toolbar'>
              {expandCollapseIcon}
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                      onClick={this.__closeModalHandler}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name='footer' />
          </div>
        </div>
      </div>
    ]
  }
}
