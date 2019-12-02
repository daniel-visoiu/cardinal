import { h, Component, Prop } from '@stencil/core';
import { RadioOption } from '../../interfaces/FormModel';

@Component({
    tag: 'psk-radio'
})
export class PskRadio {

    @Prop() label: string | null = null;
    @Prop() defaultValue?: string | null = null;
    @Prop({ reflect: true, mutable: true }) options: Array<RadioOption> | string = null;

    @Prop() required?: boolean = false;
    @Prop() disabled?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

    render() {
        if (typeof this.options === 'string') {
            this.options = this.options
                .split('|')
                .map((opt: string) => {
                    return {
                        label: opt.trim(),
                        name: opt.replace(/(\s|\.)/g, '')
                    };
                });
        }

        return (
            <div class="form-group">
                <label
                    htmlFor={this.label.replace(/\s/g, '').toLowerCase()}>
                    {this.label}
                </label>

                <div class="form-group">
                    {this.options.map((option: RadioOption) => {

                        const optionName = option.name ? option.name
                            : option.label.replace(/\s/g, '').toLowerCase();

                        const isChecked = this.defaultValue !== null
                            && (this.defaultValue === optionName
                                || this.defaultValue === option.label);

                        return (
                            <div class="form-check form-check-inline">
                                <input class="form-check-input"
                                    type="radio"
                                    name={optionName}
                                    id={optionName}
                                    checked={isChecked}
                                    value={optionName} />
                                <label
                                    class="form-check-label"
                                    htmlFor={optionName}>
                                    {option.label}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}