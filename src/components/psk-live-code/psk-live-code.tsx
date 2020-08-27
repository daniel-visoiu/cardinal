import { Component, h, Prop, Element } from '@stencil/core';

// @ts-ignore
// TODO: Check the posibility to integrate PrismJs internaly
import Prism from 'prismjs';
import PrismLiveEditor from '../../libs/prismLive.js';
import { BindModel } from '../../decorators/BindModel';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from "../../decorators/CustomTheme";

@Component({
	tag: 'psk-live-code',
	shadow: true
})
export class PskLiveCode {
	@CustomTheme()
	@BindModel() modelHandler;

	@TableOfContentProperty({
		description: 'This property provides the source code to be edited and can be updated to a defined model.',
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() value: string = '';

	@TableOfContentProperty({
		description: `This property is setting the language of the code snippet. Supported values are: markup (xml, html), javascript, css`,
		isMandatory: false,
		propertyType: `string`,
		defaultValue: 'markup'
	})
	@Prop() language: string = 'markup';

	@Element() private _hostElement: HTMLElement;

	componentDidLoad() {
		new PrismLiveEditor(this._hostElement.shadowRoot.querySelector('.live-editor-container'));
	}

	_updateViewModel = (evt) => {
		let value = evt.target.value;
		this.modelHandler.updateModel('value', value);
	}

	render() {
		return (
			<div class="live-editor-container">
				<textarea
					value={this.value}
					class={`prism-live language-${this.language}`}
					onKeyUp={this._updateViewModel}
					onChange={this._updateViewModel}
				></textarea>
			</div>
		);
	}
}
