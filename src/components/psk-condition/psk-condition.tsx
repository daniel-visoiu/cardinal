import {Component, h, Prop, State, Element, Event, EventEmitter} from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import {normalizeModelChain} from "../../utils/utilFunctions";

const SLOT_CONDITION_FALSE = 'condition-false';
const SLOT_CONDITION_TRUE = 'condition-true';

@Component({
    tag: "psk-condition",
    shadow: true
})
export class PskCondition {

    @TableOfContentProperty({
        description: `The property value must be the name of a model property or expression. Children are rendered only if the value of the condition is evaluated to true`,
        isMandatory: true,
        propertyType: `any`
    })
    @Prop() condition: any | null = null;
    @State() conditionResult: boolean = false;
    @State() modelChain;

    @Event({
      eventName: 'getModelEvent',
      cancelable: true,
      composed: true,
      bubbles: true,
    }) getModelEvent: EventEmitter;

    @Element() _host: HTMLElement;

    componentWillLoad() {

      if(!this._host.isConnected){
        return;
      }

      this.modelChain = this.condition;
      this.modelChain = normalizeModelChain(this.modelChain);

      let checkCondition = (model) => {
        if (model.hasExpression(this.modelChain)) {
          let evaluateExpression = () => {
            this.condition = model.evaluateExpression(this.modelChain);
          };
          model.onChangeExpressionChain(this.modelChain, evaluateExpression);
          evaluateExpression();
        }
        else{
          let evaluateCondition = () =>{
            this.condition = model.getChainValue(this.modelChain);
          };
          model.onChange(this.modelChain, evaluateCondition);
          evaluateCondition();
        }
      };


      return new Promise((resolve) => {
        this.getModelEvent.emit({
          callback: (err, model) => {
            if (err) {
              console.log(err);
            }

            checkCondition(model);

            this._updateConditionResult().then(() => {
              resolve();
            });
          }
        })
      });

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
