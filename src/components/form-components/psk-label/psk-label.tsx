import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
    tag: 'psk-label'
})
export class PskLabel {

    @CustomTheme()
    @BindModel() modelHandler;

    @TableOfContentProperty({
        description: ['Specifies the label to be displayed.',
            `If this attribute is not provided, the component will display the content of the component as label.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() label: string;

    @TableOfContentProperty({
        description: ['Specifies which form element a label is bound to.',
            'Usually, this attribute comes in pair with another component, and is used by the browser to group the content in a specific order to be read by screen readers.',
            'The screen readers are used by the people with disabilities in order to have the possibility to navigate a website.',
            `An example of this pair of components can be found in the <a href="#live-examples">Examples section</a>.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() for: string | null = null;

    render() {
        return (
            <label class="col-form-label" htmlFor={this.for}>
                {this.label && this.label }
                < slot />
            </label>
        );
    }
}
