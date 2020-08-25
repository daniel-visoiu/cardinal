import { Component, h, Prop, State, Event, EventEmitter, Element } from '@stencil/core';
import { WizardStep } from '../../interfaces/Wizard';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';
import CustomTheme from '../../decorators/CustomTheme';
import WizardEvent from "../../events/WizardEvent";
import {BindModel} from "../../decorators/BindModel";

@Component({
    tag: 'psk-wizard',
})
export class PskWizard {
    @BindModel() modelHandler;
    @CustomTheme()

    @Element() host;
    @TableOfContentProperty({
        description: `This property is the string that defines the psk-stepper render`,
        isMandatory: false,
        propertyType: `string`,
    })
    @Prop() componentRender: string;

    @TableOfContentProperty({
        description: `This parameter holds the wizard configuration, the names of the steps, the components that will be displayed and if there is the case, other properties, like information for the steps.`,
        isMandatory: false,
        propertyType: `array of WizardStep types (WizardStep[])`,
        specialNote: `These information are filled in and handled by the controller of the component, not by the component itself.`
    })
    @Prop({ mutable: true, reflect: true }) wizardSteps?: WizardStep[];

    @State() activeStep: WizardStep;

    componentWillLoad() {
        this.needWizardConfiguration.emit((data) => {
            this.wizardSteps = data;
            this.activeStep = this.wizardSteps.length > 0 ? this.wizardSteps[0] : null;
        });
    }

    @TableOfContentEvent({
        eventName: `needWizardConfiguration`,
        controllerInteraction: {
            required: true
        },
        description: `This event is triggered when the component is loaded and if no configuration is given for the wizard.
            In this case, the controller is responsible to send the configuration to the wizard.
            This event comes with a single parameter, a callback function that sends the configuration to the component.`
    })
    @Event({
        eventName: 'needWizardConfiguration',
        cancelable: true,
        composed: true,
        bubbles: true,
    }) needWizardConfiguration: EventEmitter;

    @TableOfContentEvent({
        eventName: `changeStep`,
        controllerInteraction: {
            required: true
        },
        description: `This event is triggered when the buttons Next, Previous and the step names from the left side of the component are clicked.
            This event comes with the following parameters:
                stepIndexToDisplay - the number of the step to be displayed,
                wizardSteps - the list of the steps from the wizard,
                activeStep - the step that will be displayed,
                callback - a callback function that is called from the controller when the validation is done.`
    })
    @Event({
        eventName: "changeStep",
        bubbles: true,
        cancelable: true,
        composed: true
    }) changeStep: EventEmitter;

    @TableOfContentEvent({
        eventName: `finishWizard`,
        description: `This event is triggered when the buttons Finish is clicked.
            This event comes with the following parameters:
                wizardSteps - the list of the steps from the wizard. Maybe the information inside the wizard will be stored somewhere,
                callback - a callback function that is called from the controller when the validation is done.`
    })
    @Event({
        eventName: "finishWizard",
        bubbles: true,
        cancelable: true,
        composed: true
    }) finishWizard: EventEmitter;

  handleStepChange(indexToAdvance: number) {

    let changeStepEvent = new WizardEvent("changeStep", {
      stepIndexToDisplay: indexToAdvance,
      wizardSteps: this.wizardSteps,
      activeStep: this.activeStep,
      callback: (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        this.activeStep = data.activeStep;
        this.wizardSteps = data.wizardSteps;
      }
    }, {
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.host.dispatchEvent(changeStepEvent);
  }

    handleFinish(): void {
        this.finishWizard.emit({
            wizardSteps: this.wizardSteps,
            callback: (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(data);
            }
        });
        return;
    }

    handleStepPropertiesChange(newProperties: any): void {
        this.activeStep["stepProperties"] = newProperties;
    }

    computeStepDesign(stepIndex: number, activeStepIndex: number, lastStepIndex: number): string {
        let stepClass: string = "";

        if (stepIndex === 0) {
            stepClass += "first ";
        } else if (stepIndex === lastStepIndex - 1) {
            stepClass += "last ";
        }

        if (stepIndex < activeStepIndex) {
            stepClass += "done";
        } else if (stepIndex === activeStepIndex) {
            stepClass += "current";
        }

        return stepClass;
    }

    render() {
        const StepComponentRenderer = this.activeStep.stepComponent;

        return [
            <div class="page-content">
                <div class="wizard-content">
                    <div class="wizard-form">
                        <form class="form-register" action="#" method="post"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                ev.stopImmediatePropagation();
                            }} >
                            <div id="form-total" class="wizard clearfix">

                                <psk-stepper
                                    componentRender={this.componentRender}
                                    wizardSteps={this.wizardSteps}
                                    activeStep={this.activeStep}
                                    handleStepChange={this.handleStepChange.bind(this)} />

                                <StepComponentRenderer
                                    {...this.activeStep.stepProperties}
                                    onPropertiesChange={this.handleStepPropertiesChange.bind(this)}
                                    stepProperties={this.activeStep.stepProperties} />

                                <div class="actions clearfix">
                                    <ul role="menu" aria-label="Pagination">
                                        {this.activeStep.stepIndex > 0
                                            ? <li>
                                                <button role="menuitem"
                                                    onClick={this.handleStepChange.bind(this, this.activeStep.stepIndex - 1)}>Previous</button>
                                            </li>
                                            : null}

                                        {this.activeStep.stepIndex < this.wizardSteps.length - 1
                                            ? <li>
                                                <button role="menuitem"
                                                    onClick={this.handleStepChange.bind(this, this.activeStep.stepIndex + 1)}>Next</button>
                                            </li>
                                            : null}

                                        {this.activeStep.stepIndex === this.wizardSteps.length - 1
                                            ? <li>
                                                <button role="menuitem"
                                                    onClick={this.handleFinish.bind(this)}>Finish</button>
                                            </li>
                                            : null}
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ]
    }
}
