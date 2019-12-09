import {h, Component, Prop, Event, EventEmitter, State} from '@stencil/core';

@Component({
  tag: 'psk-input'
})
export class PskInput {

    @Prop() label?: string | null = null;
    @Prop() type?: string = 'text';
    @Prop() value?: string | null = null;
    @Prop() name?: string | null = null;
    @Prop() defaultValue?: string | null = null;
    @Prop() placeHolder?: string | null = null;

  @Prop() required?: boolean = false;
  @Prop() readOnly?: boolean = false;
  @Prop() invalidValue?: boolean | null = null;
  @Prop() bind?: string | null = null;
  @State() model: any;
  @State() modelValue: any;


  @Event({
    eventName: 'getModelEvent',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getModelEvent: EventEmitter;

  componentWillLoad() {

    if (this.bind) {
      this.getModelEvent.emit({
        callback: (err, model) => {
          if (!err) {
            this.model = model;
            this.modelValue = this.model.getChainValue(this.bind);
            console.log(this.modelValue);
            this.model.onChange(this.bind, () => {
              console.log('bau');
              this.modelValue = this.model.getChainValue(this.bind);
            });
          } else {
            console.error(err);
          }
        }
      });
    }
  }

  changeModel = (event) => {
    event.stopImmediatePropagation();
    let value = event.target.value;
    this.model.setChainValue(this.bind, value);
  };


  render() {
    const invalidClass = this.invalidValue === null ? ''
      : this.invalidValue ? 'is-invalid' : 'is-valid';

    // const inputValue = this.value !== null ? this.value
    //   : this.defaultValue !== null ? this.defaultValue : '';

    return (
      <div class={`form-group`}>
        {this.label && <label
            htmlFor={this.label.replace(/\s/g, '').toLowerCase()}>
          {this.label}
        </label>}

        <input
          readOnly={this.readOnly}
          required={this.required}
          type={this.type}
          value={this.modelValue}
          onKeyUp={this.changeModel.bind(this)}
          name={this.label && this.label.replace(/\s/g, '').toLowerCase()}
          class={`form-control ${invalidClass}`}
          placeholder={this.placeHolder}/>
      </div>
    );
  }
}
