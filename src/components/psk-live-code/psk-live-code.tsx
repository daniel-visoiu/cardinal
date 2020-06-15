import { Component, h, Prop, Element } from '@stencil/core';

// @ts-ignore
// TODO: Check the posibility to integrate PrismJs internaly
import Prism from 'prismjs';
import PrismLiveEditor from '../../libs/prismLive.js';
import { BindModel } from '../../decorators/BindModel.js';
import CustomTheme from '../../decorators/CustomTheme.js';

@Component({
	tag: 'psk-live-code',
	shadow: true
})
export class PskLiveCode {
	@CustomTheme()
	@BindModel() modelHandler;

	@Prop() value: string;
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
