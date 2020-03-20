import { Component, h, Prop, State } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: "psk-condition",
    shadow: true
})
export class PskCondition {
    @BindModel()

	@TableOfContentProperty({
		description: `The property value must be the name of a model property or expression. Children are rendered only if the value of the condition is evaluated to true`,
		isMandatory: true,
		propertyType: `any`
	})
    @Prop() condition: any | null = null;
    @State() conditionResult: boolean = false;

    componentWillLoad() {
        return this._updateConditionResult();
    }

    componentWillUpdate() {
        return this._updateConditionResult();
    }

    _updateConditionResult(): Promise<void> {
        let conditionPromise;

        if (this.condition instanceof Promise) {
            conditionPromise = this.condition;
        } else {
            conditionPromise = Promise.resolve(this.condition);
        }

        return conditionPromise.then((result) => {
            this.conditionResult = Boolean(result);
            return Promise.resolve();
        })
    }

    render() {
        if (this.conditionResult) {
            return (
                <slot />
            );
        }
        return null;
    }
}
