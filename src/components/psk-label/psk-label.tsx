import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: 'psk-label'
})
export class PskLabel {

    @BindModel()

    @Prop() label: string | null = null;
    @Prop() for: string | null = null;

    render() {
        return (
            <label class="col-form-label" htmlFor={this.for}>
                {this.label ? this.label : < slot />}
            </label>
        );
    }
}