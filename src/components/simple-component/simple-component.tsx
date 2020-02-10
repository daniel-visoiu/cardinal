import {Component, Element, State, h} from '@stencil/core';
import {BindModel} from "../../decorators/BindModel";

@Component({
  tag: 'simple-component',
  shadow: true
})
export class SlottedElement {
  @BindModel()
  @Element() host: HTMLDivElement;
  @State() children: Array<any> = [];
  @State() slotted: HTMLElement;
  @State() data = [1,2,3];

  componentWillLoad() {
    /*
    https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
     */
    let slotted = this.host.querySelector('slot') as HTMLSlotElement;
    this.slotted = slotted;
    //this.children = slotted.assignedNodes().filter((node) => { return node.nodeName !== '#text'; });
    console.log(this.children)
  }

  render() {
    return (
      <div>
        <slot />
        <ul>
          {this.data.map(_ => { return <div data-view-model="entities.1" innerHTML={this.slotted.outerHTML} ></div>; })}
        </ul>
      </div>
    );
  }
}
