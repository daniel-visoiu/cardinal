import { h, Component, Prop } from '@stencil/core';
import { Option, SelectType } from '../../interfaces/FormModel';

@Component({
    tag: 'psk-select'
})
export class PskSelect {

    @Prop() label: string | null = null;
    @Prop() defaultValue?: string | null = null;
    @Prop() selectionType?: SelectType = 'single';
    @Prop() placeholder?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() disabled?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

    @Prop() options: Array<Option> = null;

    componentWillLoad() {
        if (this.selectionType !== 'single' && this.selectionType !== 'multiple') {
            this.selectionType = 'single';
        }
    }

    render() {
        const name: string = this.label.replace(/\s/g, '').toLowerCase();

        return (
            <div class="form-group">
                <psk-label for={name} label={this.label} />

                <select name={name} id={name} class="form-control"
                    disabled={this.disabled} required={this.required}
                    multiple={this.selectionType === 'multiple'}>

                    {this.placeholder && <option
                        disabled={true}
                        label={this.placeholder}
                        value={''} />}

                    {this.options.map((option: Option) => {
                        const value = option.value ? option.value
                            : option.label.replace(/\s/g, '').toLowerCase();

                        const selected: boolean = option.selected ? option.selected
                            : this.defaultValue === option.value;

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