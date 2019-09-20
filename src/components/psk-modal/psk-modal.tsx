import {Component, h, Prop, Event, EventEmitter, Element} from '@stencil/core';

@Component({
  tag: 'psk-modal',
  styleUrl: './psk-modal.css',
  shadow: true
})
export class PskModal {
  @Element() element: HTMLElement;

  @Prop({reflectToAttr: true, mutable: true}) opened: boolean = false;

  @Event({
    eventName: 'closeModal',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) closeModal: EventEmitter;

  render() {
    return (
      <div>
        <div id="backdrop" onClick={() => {
  this.closeModal.emit();
}}/>
        <div id="modal">

          <div class="modal-content">

            <div class="modal-header">
              <slot name="title"/>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" onClick={() => {
                  this.closeModal.emit();
                }}>&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <slot/>
            </div>

            <div class="modal-footer">
              <slot name="confirm_action"/>
              <wg-button
                label="Close"
                buttonClass="btn btn-primary"
                eventEmitter={this.closeModal}
              />
            </div>

          </div>
        </div>
      </div>
    );
  }
}
