import { Component, h, Prop, Element } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { BindModel } from '../../decorators/BindModel';
import PskButtonEvent from "../../events/PskButtonEvent";

@Component({
	tag: 'psk-files-chooser',
	styleUrl: "../../../themes/commons/bootstrap/css/bootstrap.css"
})

export class PskFilesChooser {
	@CustomTheme()

	@BindModel() modelHandler;
	@Element() htmlElement: HTMLElement;
	@TableOfContentProperty({
		description: `This is the lable of the button`,
		isMandatory: false,
		propertyType: `string`,
		defaultValue: `Select files`
	})
	@Prop() label: string = "Select files";

	@TableOfContentProperty({
		description: `This property tells the component which types of files can be uploaded from the user's device.`,
		isMandatory: false,
		propertyType: `string`,
		specialNote: `If this property is missing, then all types of files can be uploaded.`
	})
	@Prop() accept?: string;
	@Prop() eventName?: string;

	// @TableOfContentProperty({
	// 	description: `This property tells the component what to do with the selected uploaded files.
	// 		If this property is missing, then nothing will happen with the selected uploaded files.`,
	// 	isMandatory: false,
	// 	propertyType: `Function`,
	// 	specialNote: `A hint message will be displayed for the user, to know that a controller for the component is not set.`
	// })
	// @Prop() onFilesSelect?: Function;
	addedFile(event) {
		let filesArray = Array.from(event.target.files);

		if (this.eventName) {
			event.preventDefault();
			event.stopImmediatePropagation();
			let pskFileChooserEvent = new PskButtonEvent(this.eventName, filesArray, {
				bubbles: true,
				composed: true,
				cancelable: true
			});
			let eventDispatcherElement = this.htmlElement;
			eventDispatcherElement.dispatchEvent(pskFileChooserEvent);
		}
	}

	render() {
		let directoryAttributes = {};
		if (this.accept === 'directory') {
			directoryAttributes = {
				directory: true,
				mozdirectory: true,
				webkitdirectory: true
			};
			this.accept = null;
		}

		return [
			<button type="button" class="btn btn-secondary p-0">
				<label class="pt-0 mb-0 p-2">
					{this.label}
					<input
						multiple
						{...directoryAttributes}
						accept={this.accept}
						type="file"
						onChange={this.addedFile.bind(this)}
						class="form-control-file form-control-sm" />
				</label>
			</button>,
			!this.eventName ? <h5 class="mt-4">No controller set for this component!</h5> : null
		]
	}
}
