import { Component, Prop, h } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
    tag: "psk-icon",
    shadow: true
})
export class PskIcon {
    @CustomTheme()

    @TableOfContentProperty({
        isMandatory: true,
        propertyType: 'string',
        description: [`This property is mandatory and it is the icon defined in font-awesome Cascading Style Sheet .`,
            `We choose to use these icons because they are popular and quite expressive and very easy to use.(Example: user,`]
    })
    @Prop() icon: string | null;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'boolean',
        description: [
            'This property is used for disabling the color of the icon. The default color is grey..',
            'If this property is not given, false is assumed'
        ],
        defaultValue: 'false'
    })
    @Prop() disableColor?: boolean = false;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'string',
        description: [
            'This property gives the color of the icon. ',
            'If this property is not given, blue color (rgba(0, 0, 255, 1)) is assumed'
        ],
        defaultValue: 'rgba(0, 0, 255, 1)'
    })
    @Prop() color?: string = 'rgba(0, 0, 255, 1)';

    render() {
        return this.icon && <span
            style={{ color: this.color }}
            class={`icon fa fa-${this.icon} ${this.disableColor ? 'disable-color' : ''}`}
        />;
    }
}