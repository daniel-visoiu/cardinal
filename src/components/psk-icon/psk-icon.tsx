import { Component, Prop, h } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { BindModel } from "../../decorators/BindModel";

@Component({
    tag: "psk-icon",
    styleUrls: [
        "../../assets/fonts/font-awesome/font-awesome.min.css",
        "../../assets/css/bootstrap/bootstrap.min.css"],
})
export class PskIcon {
    @CustomTheme()
    @BindModel() modelHandler;

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
        description: ['This property gives the color of the icon.']
    })
    @Prop() color?: string | null;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'string',
        description: [
            `By defining this property, you can assign more css classes according to your design needs.`,
            `These classes will be attached to the existing class, <code>icon fa</code>. In the below examples, you can also find how to use it.`
        ],
        specialNote: [
            `Pay attention on how you use this attribute because if the attribute <code>color</code> is provided and in one of your CSS files you set another color, the <code>color</code> attribute has priority over CSS selectors (except the case when you use !important).`,
            `The below examples will illustrate this behaviour.`
        ]
    })
    @Prop() classes?: string | null;

    render() {
        if (!this.icon) {
            return null;
        }

        let classList = this.icon;

        if (this.disableColor) {
            classList = `${classList} disable-color`;
        }

        if (this.classes && this.classes.length) {
            classList = `${classList} ${this.classes}`;
        }

        return <span style={{ color: this.color }} class={`icon fa fa-${classList}`} />;
    }
}
