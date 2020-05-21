import { h, Component, Prop, Listen, Element, State } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { RadioOption } from '../../../interfaces/FormModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
    tag: 'psk-radio-group'
})
export class PskRadioGroup {

    @CustomTheme()

    @BindModel() modelHandler;

    @State() options: Array<RadioOption> = null;

    @Element() private _host: HTMLElement;

    @Listen('onChangeRadio')
    onChangeRadioHandler(evt: CustomEvent): void {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        if (!evt.detail || !evt.detail.value) {
            return;
        }
        const radioButtons = this._host.querySelectorAll("psk-radio");
        radioButtons.forEach((radio: Element) => {
            const inputRadio: HTMLInputElement = radio.getElementsByTagName('input')[0];
            if (inputRadio.value === evt.detail.value) {
                this.value = evt.detail.value;
                this.__updateModel.call(this);
                inputRadio.checked = true;
            } else {
                inputRadio.checked = false;
            }
        });
    }

    render() {
        return (
            <div class="form-group">
                <psk-label for={this.name} label={this.label} />

                <div id="psk-radio-group"
                    class={`form-group`}>
                    {this.options && this.options.map((option: RadioOption) => {
                        const inputName = option.name ? option.name
                            : (option.label && option.label.replace(/\s/g, '').toLowerCase());

                        return <psk-radio {...option}
                            name={inputName} />
                    })}
                    <slot />
                </div>
            </div>
        );
    }

    __updateModel(): void {
      this.modelHandler.updateModel('value', this.value);
    }

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display above the group, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() label?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the selected value of a psk-radio component inside the group.`,
            `This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link page="forms/using-forms">Using forms</psk-link>.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop({ reflect: true, mutable: true }) value?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the name of a psk-radio-group component. It is used along with the psk-label component.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() name?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies that a psk-radio inside the group must be checked before submitting the form.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() required?: boolean = false;

    @TableOfContentProperty({
        description: [`This property indicates if the value entered by the user is a valid one according to some validation present in the controller.`],
        isMandatory: false,
        propertyType: 'boolean',
        specialNote: `For the moment, there is no visual implelentation for this attribute, but it will be in a further iteration.`
    })
    @Prop() invalid?: boolean = true;
}
