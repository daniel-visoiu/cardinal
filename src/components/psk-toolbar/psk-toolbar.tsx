import { Component, Prop, h, Element } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import { ACTIONS_ICONS } from '../../utils/constants';
import { createCustomEvent } from '../../utils/utils';

@Component({
    tag: "psk-toolbar",
    shadow: true
})
export class PskToolbar {
    @CustomTheme()

    @Prop() actions: string | null;
    @Prop() icons: boolean = false;
    @Prop() eventData: string | null;

    @Element() private host: HTMLElement;

    render() {
        if (!this.actions) return null;

        return this.actions
            .split(',')
            .map(e => e.trim())
            .map(action => {
                let index = 0;
                while (index < this.host.children.length) {
                    let child = this.host.children.item(index++);
                    if (child.hasAttribute('slot')
                        && child.getAttribute('slot') === action) {
                        return <slot name={action} />;
                    }
                }
                return this.icons && ACTIONS_ICONS.hasOwnProperty(action)
                    ? <psk-icon icon={ACTIONS_ICONS[action].value}
                        title={ACTIONS_ICONS[action].value}
                        color={ACTIONS_ICONS[action].color}
                        onClick={(evt) => { this.handleClick(evt, action); }} />
                    : <button
                        class="btn btn-primary"
                        name={action.toUpperCase()}
                        onClick={(evt) => { this.handleClick(evt, action); }}>
                        {action.toUpperCase()}
                    </button>;
            });
    }

    handleClick(evt: MouseEvent, action: string): void {
        let evData = null;
        try {
            evData = JSON.parse(this.eventData);
        } catch (e) { }

        evt.preventDefault();
        evt.stopImmediatePropagation();
        createCustomEvent(action, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: evData
        }, true);
    }
}