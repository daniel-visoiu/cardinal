import {Component, h, Prop, State, Element, Event, EventEmitter} from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import {normalizeModelChain, stringToBoolean} from "../../utils/utilFunctions";

const SLOT_CONDITION_FALSE = 'condition-false';
const SLOT_CONDITION_TRUE = 'condition-true';

@Component({
  tag: "psk-condition"
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

    private falseSlot = null;
    private trueSlot = null;

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

        this.falseSlot = null;
        const children = Array.from(this._host.children);

        let trueSlotsElements = children.filter((child)=>{
          const slotName = child.getAttribute('slot');
          return  slotName === SLOT_CONDITION_TRUE;
        });

        this.trueSlot = trueSlotsElements.map((slotElement)=>{return slotElement.outerHTML}).join("")

        let falseSlotsElements = children.filter((child)=>{
          const slotName = child.getAttribute('slot');
          return  slotName === SLOT_CONDITION_FALSE;
        });

        this.falseSlot = falseSlotsElements.map((slotElement)=>{return slotElement.outerHTML}).join("")

        if (this.trueSlot.length === 0 && this.falseSlot.length === 0) {
          this.trueSlot = children.map(child => {
            return child.outerHTML;
          }).join("");
        }

        this._host.innerHTML = "";

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

    _updateConditionResult(): Promise<void> {
        let conditionPromise;

        if (this.condition instanceof Promise) {
            conditionPromise = this.condition;
        } else {
            conditionPromise = Promise.resolve(this.condition);
        }

        return conditionPromise.then((result) => {
            this.conditionResult = stringToBoolean(result);
            return Promise.resolve();
        })
    }

    render() {
      return <psk-hoc innerHTML={this.conditionResult ? this.trueSlot : this.falseSlot}/>;
    }
}
