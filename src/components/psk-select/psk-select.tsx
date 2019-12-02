import { h, Component, Prop } from '@stencil/core';
import { SelectOption, SelectType } from '../../interfaces/FormModel';

@Component({
    tag: 'psk-select'
})
export class PskRadio {

    @Prop() label: string | null = null;
    @Prop() defaultValue?: string | null = null;
    @Prop({ reflect: true, mutable: true }) options: Array<SelectOption> = null;
    @Prop() selectionType?: SelectType = 'single';

    @Prop() required?: boolean = false;
    @Prop() disabled?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

    componentWillLoad() {
        console.log(this.selectionType);
        if (this.selectionType !== 'single' && this.selectionType !== 'multiple') {
            this.selectionType = 'single';
        }
    }

    render() {
        return (
            <div class="form-group">
                <label
                    htmlFor={this.label.replace(/\s/g, '').toLowerCase()}>
                    {this.label}
                </label>

                {
                    this.selectionType === 'single'
                        ? this._selectWithSingleOption.call(this)
                        : this._selectMultipleOptions.call(this)
                }
            </div>
        );
    }

    _selectWithSingleOption() {
        return <p>{this.selectionType}</p>;
    }

    _selectMultipleOptions() {
        return <p>{this.selectionType}</p>;
    }
}