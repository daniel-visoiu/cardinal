import { Component, Prop, h, Element } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

const ignoredComponents = ["link","psk-for-each"];
@Component({
    tag: "psk-grid"
})
export class PskGrid {
    @CustomTheme()

    @TableOfContentProperty({
        isMandatory: true,
        propertyType: 'number',
        description: 'This is the number of columns for the bootstrap columns class.',
        defaultValue: 'null',
        specialNote: `That number can only be an integer between 1 and 12`
    })
    @Prop() columns: number | null;

    @Element() host: HTMLElement;

    render() {
        if (!this.columns) {
            return;
        }

        let className = `col-12 col-md-${Math.floor(12 / this.columns)}`;
        let index = 0;
        while (index < this.host.children.length) {
          const child: Element = this.host.children.item(index++);

          if (ignoredComponents.indexOf(child.tagName.toLowerCase()) !== -1) {
            continue;
          }

          if(!child.className.startsWith("col-")){
            child.className = className;
          }
        }

        return <div class="row">
            <slot />
        </div>;
    }
}
