import { Component, Prop, Element } from "@stencil/core";
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: "psk-condition"
})
export class PskCondition {

    @BindModel()

    @Prop() condition: any | null = null

    @Element() private _host: HTMLElement

    componentWillLoad() {
        if (this.condition instanceof Promise) {
            return this.condition.then((result) => {
                if (!result) {
                    this._host.innerHTML = '';
                }
                return Promise.resolve();
            })
        }
        if (!this.condition) {
            this._host.innerHTML = '';
        }
    }
}
