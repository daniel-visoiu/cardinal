import { Component, h, Prop, State, Element } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { BindModel } from '../../decorators/BindModel';

const SLOT_CONDITION_FALSE = 'condition-false';
const SLOT_CONDITION_TRUE = 'condition-true';

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

    @Element() _host: HTMLElement;

    componentWillLoad() {
        return this._updateConditionResult();
    }

    componentWillUpdate() {
        return this._updateConditionResult();
    }

    _stringToBoolean(str) {
        switch (str.toLowerCase().trim()) {
            case "true":
            case "1":
                return true;
            case "false":
            case "0":
            case null:
                return false;
            default: return Boolean(str);
        }
    }

    _updateConditionResult(): Promise<void> {
        let conditionPromise;

        if (this.condition instanceof Promise) {
            conditionPromise = this.condition;
        } else {
            conditionPromise = Promise.resolve(this.condition);
        }

        return conditionPromise.then((result) => {
            if(typeof result === "string"){
                this.conditionResult = this._stringToBoolean(result);
            } else {
                this.conditionResult = Boolean(result);
            }
            return Promise.resolve();
        })
    }

    render() {
        let renderIfElseSlots = false;

        let trueSlot = <slot />;
        let falseSlot = null;

        const children = this._host.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const slotName = child.getAttribute('slot');

            if (slotName === SLOT_CONDITION_TRUE || slotName === SLOT_CONDITION_FALSE) {
                renderIfElseSlots = true;
                break;
            }
        }

        if (renderIfElseSlots) {
            trueSlot = <slot name={`${SLOT_CONDITION_TRUE}`} />;
            falseSlot = <slot name={`${SLOT_CONDITION_FALSE}`} />;
        }

        return this.conditionResult ? trueSlot : falseSlot;
    }
}
