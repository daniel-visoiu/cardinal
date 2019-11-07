import { Component, h, Prop } from '@stencil/core';
import { WgFile } from "../../interfaces/WgFile";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
	tag: 'psk-files-chooser',
	shadow: true
})

export class PskFilesChooser {
	@CustomTheme()
	@TableOfContentProperty({
		description:`This is the lable of the button`,
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

	@TableOfContentProperty({
		description: `This property tells the component what to do with the changed uploaded files.
			If this property is missing, then nothing will happen with the changed uploaded files.`,
		isMandatory: false,
		propertyType: `Function`,
		specialNote: `A hint message will be displayed for the user, to know that a controller for the component is not set.`
	})
	@Prop() onFilesChange?: Function;

	@TableOfContentProperty({
		description: `This property tells the component what to do with the selected uploaded files.
			If this property is missing, then nothing will happen with the selected uploaded files.`,
		isMandatory: false,
		propertyType: `Function`,
		specialNote: `A hint message will be displayed for the user, to know that a controller for the component is not set.`
	})
	@Prop() onFilesSelect?: Function;

	addedFile(event) {

		let filesArray = Array.from(event.target.files);
		if (typeof this.onFilesChange === "function") {
			this.onFilesChange(filesArray);
		}

		if (typeof this.onFilesSelect === "function") {
			let files: WgFile[] = filesArray.map((attachment: any) => {

				return {
					name: attachment.name,
					size: attachment.size,
					type: attachment.name.substr(attachment.name.lastIndexOf(".") + 1)
				};
			});
			this.onFilesSelect(files);
		}
	}

	render() {
		return [
			<button type="button" class="btn btn-secondary p-0">
				<label class="pt-0 mb-0 p-2">
					{this.label}
					<input accept={this.accept} type="file" onChange={this.addedFile.bind(this)} multiple
						class="form-control-file form-control-sm" />
				</label>
			</button>,
			!this.onFilesChange && !this.onFilesSelect ? <h5 class="mt-4">No controller set for this component!</h5> : null
		]
	}
}
