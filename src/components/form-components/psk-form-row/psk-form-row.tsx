import { Component, h, Element, Prop } from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';

@Component({
    tag: 'psk-form-row'
})
export class PskForm {

    @CustomTheme()

    @Element() private __host: HTMLElement;

    render() {
        let columns = this.__host.children.length;
        Array.from(this.__host.children).forEach(function (el: Element) {
            if (el.tagName.toLowerCase() === 'link') {
                columns--;
            }
        });

        return <psk-grid
            columns={columns}
            layout={this.layout}>
            <slot />
        </psk-grid>;
    }

    @TableOfContentProperty({
        isMandatory: true,
        propertyType: 'string',
        description: ['This attribute will set the layout for the components inside the grid, according to the number of columns.',
            `Example: <psk-grid columns="3" layout="xs=[12,12,12] s=[6,6,12] m=[3,3,6] l=[3,4,5]" xl=[3,4,5]>`,
            `There are 5 possible breakpoints, according to Bootstrap documentation: xs, s, m, l and xl. For each breakpoint you want to use, the number of the values must be the same with the number of the columns, otherwise, the breakpoint will be ignored.`,
            `Each breakpoint will be written in the following manner: breakpoint=[value1, value2,... valueN], where N is the number of columns and the value accepts numbers between 0 and 12 included, or the string "auto".`,
            `If a value is 0, then the element for that column will be hidden. If a value is auto, it will have no bootstrap class and will inherit the design.`,
            `If any other value is set, the breakpoint will be ignored even if it has the same number of columns.`],
        defaultValue: 'null'
    })
    @Prop() layout: string | null = null;
}