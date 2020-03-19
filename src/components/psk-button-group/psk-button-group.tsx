import { Component, h, Prop } from '@stencil/core';

import CustomTheme from '../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { BindModel } from '../../decorators/BindModel';


@Component({
    tag: 'psk-button-group'
})
export class ButtonGroup {
    @BindModel()

    @CustomTheme()

    render() {
        if (!this.label && !this.icon) {
            return null;
        }

        const position = this.menuOrientation !== 'left' && this.menuOrientation !== 'right'
            ? 'left' : this.menuOrientation;
        const menuDesign = `list-group ${position}-orientation`;

        return (
            <div class="button-group-wrapper">
                <div class="trigger" onClick={(event) => {
                    event.preventDefault();
                    this.opened = !this.opened;
                }}>
                    {this.icon && <psk-icon icon={this.icon} color={this.iconColor} />}
                    {this.label && this.label}
                </div>
                <div class={menuDesign}>
                    <slot />
                </div>
            </div>
        );
    }

    @TableOfContentProperty({
        description: [
            `This property shows the state of the button group, if it is expanded or collapsed.`
        ],
        isMandatory: false,
        propertyType: `boolean`,
        defaultValue: `false`
    })
    @Prop({ reflectToAttr: true, mutable: true }) opened: boolean = false;

    @TableOfContentProperty({
        description: [
            'This is the label that will be displayed for the button. If it is not set, the button group will not be displayed.',
        ],
        isMandatory: true,
        propertyType: 'string'
    })
    @Prop() label: string | null;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'string',
        description: [
            'This property gives the color of the icon.'
        ],
        defaultValue: 'null'
    })
    @Prop() icon: string | null;

    @TableOfContentProperty({
        isMandatory: true,
        propertyType: 'string',
        description: [
            `This property is mandatory and it is the icon defined in font-awesome Cascading Style Sheet .`,
            `We choose to use these icons because they are popular and quite expressive and very easy to use.(Example: user, eye, share, download`
        ]
    })
    @Prop() iconColor: string | null;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'string',
        description: [
            `This property is setting the orientation of the menu, left or right. This orientation helps on set the optimal position of the menu according to the position of the component in page.`
        ],
        defaultValue: 'left'
    })
    @Prop() menuOrientation: string = 'left';
}