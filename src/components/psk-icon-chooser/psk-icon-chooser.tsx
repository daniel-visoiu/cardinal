import {Component, Element, h, Prop, State} from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import {BindModel} from "../../decorators/BindModel";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";
import {iconModels} from "./iconModels.js"

@Component({
  tag: "psk-icon-chooser",
  styleUrl: "./psk-icon-chooser.css"
})
export class PskIconChooser {
  @BindModel() modelHandler;
  @CustomTheme()
  @Element() element;

  @State() iconsModelListToShow = null;

  @TableOfContentProperty({
    isMandatory: false,
    propertyType: 'string',
    description: ['This property gives the color of the icons.']
  })
  @Prop() iconsColor?: string | null;

  @TableOfContentProperty({
    isMandatory: false,
    propertyType: 'string',
    description: ['This property gives the size of the icons.']
  })
  @Prop() iconsSize?: string | null;

  @TableOfContentProperty({
    description: [`Specifies the value of a psk-icon-chooser component.`, `This value is updated also in the model using the two-way binding.`],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() value: string | null = null;

  private groupSelection = {
    options: Array.from(new Set(iconModels.map(iconModel => iconModel.group))),
    value: ''
  }

  private searchTextBox = {
    placeholder: 'Search ...',
    value: ''
  }

  __iconModelContainsSearchBoxString = (iconModel) => {
    let strLower = this.searchTextBox.value.toLowerCase();
    return iconModel.group.toLowerCase().includes(strLower) || iconModel.name.toLowerCase().includes(strLower);
  }

  __iconModelContainsCategory = (iconModel) => {
    return this.groupSelection.value === '' || iconModel.group.toLowerCase() === this.groupSelection.value.toLowerCase();
  }

  __getCategorySelections = () => {
    return this.groupSelection.options.map(this.__mapGroupToOption);
  }

  __mapGroupToOption = (group) => {
    return <option value={group.toLowerCase()}>{group}</option>;
  }

  __getIconDivArrayList = () => {
    return iconModels
      .filter(this.__iconModelContainsCategory)
      .filter(this.__iconModelContainsSearchBoxString)
      .map(this.__mapIconToDiv);
  }

  __mapIconToDiv = (iconModel) => {
    return <div>
      <psk-button
        eventName={'icon-click'}
        eventData={iconModel.id}>
        <span style={{color: this.iconsColor, fontSize: this.iconsSize}} class={`icon fa fa-${iconModel.id}`}/>
      </psk-button>
    </div>
  }

  __inputHandler = (event) => {
    event.stopImmediatePropagation();
    this.searchTextBox.value = event.target.value;
    this.iconsModelListToShow = this.__getIconDivArrayList();
  };

  __iconClickListener = (event) => {
    event.stopImmediatePropagation();
    this.modelHandler.updateModel('value', event.data);
  }

  __categoryChangeListener = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.groupSelection.value = event.target.value;
    this.iconsModelListToShow = this.__getIconDivArrayList();
  }

  componentDidLoad() {
    this.element.addEventListener("icon-click", this.__iconClickListener.bind(this));
  }

  componentWillLoad() {
    this.iconsModelListToShow = this.__getIconDivArrayList();
  }

  render() {
    return <div>
      <div class="icon-chooser-header">
        <select class="form-control" onChange={this.__categoryChangeListener.bind(this)}>
          <option value={""}>All</option>
          {this.__getCategorySelections()}
        </select>

        <psk-input
          type="text"
          value={this.searchTextBox.value}
          placeholder={this.searchTextBox.placeholder}
          specificProps={{
            onKeyUp: this.__inputHandler.bind(this),
            onChange: this.__inputHandler.bind(this)
          }}/>

      </div>
      <div class="icon-chooser-content">
        {this.iconsModelListToShow}
      </div>
    </div>;
  }
}
