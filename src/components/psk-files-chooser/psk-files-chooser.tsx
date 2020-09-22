import { Component, h, Prop, Element } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { BindModel } from '../../decorators/BindModel';
import PskButtonEvent from "../../events/PskButtonEvent";

@Component({
	tag: 'psk-files-chooser',
	styleUrl: "../../assets/css/bootstrap/bootstrap.css"
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

  triggerBrowseFile(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    this.htmlElement.querySelector("input").click();
  }

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

			/**
			 * SPA issue: When you try to upload the same file/folder, onChange event is not triggered.
			 * Solution: Reset the input after the files are emitted via dispatchEvent.
			 */
			event.target.value = null;
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
			<button type="button" class="btn btn-secondary" onClick={this.triggerBrowseFile.bind(this)}>
        <slot/>
				<label>
					{this.label}
					<input
						multiple
						{...directoryAttributes}
						accept={this.accept}
						type="file"
            onClick={(event)=>{event.stopImmediatePropagation()}}
						onChange={this.addedFile.bind(this)}
						class="form-control-file form-control-sm" />
				</label>
			</button>,
			!this.eventName ? <h5 class="mt-4">No controller set for this component!</h5> : null
		]
	}
}
