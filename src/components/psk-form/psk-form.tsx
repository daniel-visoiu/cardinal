import { Component, h, Prop } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme.js';

@Component({
    tag: 'psk-form',
    shadow: true
})
export class PskForm {
    @CustomTheme()

    @Prop({ mutable: true, reflect: true }) model: string | null = null;
    @Prop() controllerName: string | null;
    @Prop() formActions: string | null = 'submit';

    render() {

        return (
            <psk-container controllerName={this.controllerName}>
                <div class="container">
                    <form>
                        <slot />

                        <div id="#actions">
                            {this._createFormActions(this.formActions)}
                        </div>
                    </form>
                </div>
            </psk-container>
        );
    }

    _createFormActions(formActions: string): Array<HTMLElement> {
        let actions: Array<HTMLElement> = [];

        actions = formActions.split(",").map((action: string) => {
            return <psk-button
                eventName={action}
                label={action.toUpperCase()} />
        });

        return actions;
    }
}