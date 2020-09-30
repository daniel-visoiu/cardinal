import { Component, h, Prop, Listen, getElement } from '@stencil/core';

import CustomTheme from '../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { BindModel } from '../../decorators/BindModel';
import {stringToBoolean} from "../../utils/utilFunctions";


@Component({
    tag: 'psk-button-group',
    styleUrl:"../../assets/css/bootstrap/bootstrap.css"
})
export class PskButtonGroup {
    @BindModel() modelHandler;

    @CustomTheme()

    render() {
        if (typeof this.opened === "string") {
          this.opened = stringToBoolean(this.opened);
        }

        if (!this.label && !this.icon) {
            return null;
        }

        return (
            <div class={`button-group-wrapper ${this.classes}`}>
                <div class="trigger" onClick={this._handleMouseClick}>
                    {this.icon && <psk-icon icon={this.icon} color={this.iconColor} />}
                    {this.label && this.label}
                </div>
                <div class="list-group">
                    <slot />
                </div>
            </div>
        );
    }

    _handleMouseClick = (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        let target = evt.target as HTMLElement;
        if (getElement(this).contains(target)) {
            this.opened = !this.opened;
        }
    }

    @Listen('click', { capture: true, target: "window" })
    handleClickOutside(evt: Event) {
        let thisElement: HTMLElement = getElement(this);
        let listGroup = thisElement.querySelector("div.list-group");
        let trigger = thisElement.querySelector("div.trigger");
        let composedPath = evt.composedPath();
        //do not turn off menu on a misleading click/touch.
        if(composedPath[0] === listGroup){
          return;
        }

        let listGroupInPath = composedPath.indexOf(listGroup) > 1;
        let triggerInPath = composedPath.indexOf(trigger) > -1;

        // Turn off the menu, only if the click is coming from outside the component.
        // If the click is coming from outside the component, let the onClick event attached to the div.trigger handle the click
        if (!triggerInPath || listGroupInPath) {
            this.opened = false;
        }
    }

    @TableOfContentProperty({
        description: [
            `This property shows the state of the button group, if it is expanded or collapsed.`
        ],
        isMandatory: false,
        propertyType: `boolean`,
        defaultValue: `false`
    })
    @Prop({ reflect: true, mutable: true }) opened: boolean = false;

    @TableOfContentProperty({
        description: [
            'This is the label that will be displayed for the button. If it is not set, the button group will not be displayed.',
        ],
        isMandatory: true,
        propertyType: 'string'
    })
    @Prop({reflect:true}) label: string | null;

    @TableOfContentProperty({
        isMandatory: true,
        propertyType: 'string',
        description: [
            `This property is mandatory and it is the icon defined in font-awesome Cascading Style Sheet .`,
            `We choose to use these icons because they are popular and quite expressive and very easy to use.(Example: user, eye, share, download`
        ],
        defaultValue: 'null'
    })
    @Prop() icon: string | null;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'string',
        description: [
            'This property gives the color of the icon.'
        ]
    })
    @Prop() iconColor: string | null;

    @TableOfContentProperty({
        isMandatory: false,
        propertyType: 'string',
        description: [
            `By defining this property, you can assign more css classes according to your design needs.`,
            `These classes will be attached to the existing class, <code>button-group-wrapper</code>. Below in the examples section, this attribute is better illustrated.`
        ]
    })
    @Prop() classes: string | null = '';
}
