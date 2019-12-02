import { Component, h, Prop } from '@stencil/core';
import { FormModel, FormRow, FormComponent, FormAction } from '../../interfaces/FormModel.js';
import { createCustomEvent } from '../../utils/utils.js';
import CustomTheme from '../../decorators/CustomTheme.js';

@Component({
    tag: 'psk-form',
    shadow: true
})
export class PskForm {
    @CustomTheme()

    @Prop({ mutable: true, reflect: true }) model: string | null = null;
    @Prop({ mutable: true, reflect: true }) formModel: FormModel;
    @Prop() controllerName: string = 'DefaultController';

    componentWillLoad() {
        if (this.model) {
            this.formModel = JSON.parse(this.model);
        }
    }

    render() {
        if (!this.formModel
            || !this.formModel.components
            || this.formModel.components.length === 0) {
            return;
        }

        return (
            <div class="container">
                <form>
                    {this.formModel.components.map((formRow: FormRow) => this._renderRow(formRow))}
                    {this._renderFormActions(this.formModel.actions)}
                </form>
            </div>
        );
    }

    _renderRow(formRow: FormRow) {
        if (formRow.row.length === 0) {
            return null;
        }

        switch (formRow.rowType) {
            case 'normal': {
                return (
                    <div class="form-group row">
                        {formRow.row.map((formComponent: FormComponent) => {
                            return (<formComponent.componentName
                                {...formComponent}
                                class="col-md-4" />);
                        })}
                    </div>
                );
            }

            case 'wide': {
                return formRow.row.map((formComponent: FormComponent) => {
                    return (
                        <div class="form-group row">
                            <formComponent.componentName
                                {...formComponent}
                                class="col-md-12" />
                        </div>
                    );
                })
            }

            default: return null;
        }
    }

    _handleClickActionButton(evt: MouseEvent, eventName: string = 'defaultSubmit') {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        createCustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancellable: true
        }, true);
    }

    _renderFormActions(formAction: Array<FormAction>) {
        if (formAction.length === 0) {
            console.log('empty form actions');
            return <input
                type={'submit'}
                value={'Submit'}
                class="btn btn-primary"
                onClick={(evt: MouseEvent) => {
                    this._handleClickActionButton(evt, 'defaultSubmit');
                }} />;
        }
        return (
            <div class="row">
                <div id="actions" class="col-md-4 align-self-end">
                    {formAction.map((action: FormAction) => {
                        const props = {
                            type: (!action.type
                                || (action.type !== 'submit'
                                    && action.type !== 'reset'))
                                ? 'submit' : action.type,
                            value: action.name
                        };

                        return <input
                            {...props}
                            class="btn btn-primary"
                            onClick={(evt: MouseEvent) => {
                                if (action.type === 'reset') {
                                    return;
                                }
                                this._handleClickActionButton(evt, action.eventName);
                            }} />;
                    })}
                </div>
            </div>
        );
    }
}