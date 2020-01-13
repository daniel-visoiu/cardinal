import { Component, h, Prop, Element } from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme.js';

@Component({
    tag: 'psk-form',
    shadow: true
})
export class PskForm {
    @CustomTheme()

    @Prop() controllerName: string | null;
    @Prop() formActions: string | null = 'submit';

    @Element() private _host: HTMLElement;

    render() {

        return (
            <psk-container controllerName={this.controllerName} parentHost={this._host}>
                <div class="container">
                    <form>
                        <slot />

                        <div id="actions">
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