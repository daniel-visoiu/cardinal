import { h, Component, Prop, State } from '@stencil/core';
import { Option, SelectType } from '../../interfaces/FormModel';
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: 'psk-select'
})
export class PskSelect {

    @BindModel()

    @Prop() label: string | null = null;
    @Prop() value?: string | null = null;
    @Prop() selectionType?: SelectType = 'single';
    @Prop() placeholder?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() disabled?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

    @State() options: Array<Option> = null;

    componentWillLoad() {
        if (this.selectionType !== 'single' && this.selectionType !== 'multiple') {
            this.selectionType = 'single';
        }
    }

    __onChangeHandler(evt): void {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        let value = evt.target.value;
        if (this['changeModel']) {
            this['changeModel'].call(this, 'value', value);
        } else {
            console.warn('[psk-select] Function named -=changeModel=- is not defined!');
        }
    }

    render() {
        const name: string = this.label.replace(/( |:|\/|\.|-)/g, "").toLowerCase();

        return (
            <div class="form-group">
                <psk-label for={name} label={this.label} />

                <select name={name} id={name} class="form-control"
                    disabled={this.disabled} required={this.required}
                    multiple={this.selectionType === 'multiple'}
                    onChange={this.__onChangeHandler.bind(this)} >

                    {this.placeholder && <option
                        disabled={true}
                        label={this.placeholder}
                        value={''}
                        selected={this.value === null} />}

                    {this.options && this.options.map((option: Option) => {
                        const value = option.value ? option.value
                            : option.label.replace(/( |:|\/|\.|-)/g, "").toLowerCase();

                        const selected: boolean = option.selected ? option.selected
                            : this.value === option.value;

                        return (
                            <option
                                selected={selected}
                                value={value}
                                label={option.label}
                                disabled={option.disabled}
                            />
                        );
                    })}
                </select>
            </div>
        );
    }
}