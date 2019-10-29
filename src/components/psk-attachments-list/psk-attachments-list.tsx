import { Component, h, Prop } from '@stencil/core';
import { WgFile } from "../../interfaces/WgFile";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

@Component({
	tag: 'psk-attachments-list',
	styleUrl: './psk-attachments-list.css',
	shadow: true
})

export class PskAttachmentsList {

	@TableOfContentProperty({
		description:`This parameter holds the files that can be downloaded. They can be downloaded one by one by clicking on the desired file, or all at the same time.
		<i>Note: <code>WgFile</code> is a custom type. Inside it, the following information can be stored:</i>
			<ul>
				<li>name of the file</li>
				<li>size of the file</li>
				<li>type of the file (by extension)</li>
				<li><b><code>?</code></b> content of the file</li>
			</ul>`,
		isMandatory:true,
		propertyType: 'array of WgFile items (WgFile[])'
	})
	@Prop() files: WgFile[] = [];

	@TableOfContentProperty({
		description: `If this property is given to the component, then a red X will be displayed on the right of each file card giving the possibility to remove the file (this functionality should be implemented by the programmer providing him the possibility to have custom behavior before the deletion of the file).`,
		specialNote: `The function will receive one parameter, the index of the file in the WgFile array.`,
		isMandatory: false,
		propertyType: 'Function',
		defaultValue: 'null'
	})
	@Prop() removeFileFromList?: Function = null;

	static bytesToSize(bytes) {
		if (bytes == 0) return '0 Byte';
		let sizeIndex = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
		return Math.round(bytes / Math.pow(1024, sizeIndex)) + ' ' + sizes[sizeIndex];
	}

	render() {
		if (!this.files || this.files.length === 0) {
			return <h5>No attachments available!</h5>;
		}

		let filesView = this.files.map((file, index) => {

			let fileType = null;
			switch (file.name.substr(file.name.lastIndexOf(".") + 1)) {
				case "pdf":
					fileType = "fa-file-pdf-o";
					break;
				case "xls":
					fileType = "fa-file-excel-o";
					break;
				case "doc":
					fileType = "fa-file-word-o";
					break;
				case "jpg":
				case "png":
					fileType = "fa-file-picture-o";
					break;
				default:
					fileType = "fa-file-o";
			}

			return <button type="button" class="btn btn-primary mr-2 mt-2">
				<span class={`icon mr-1 fa ${fileType}`} />{file.name}
				<span class="badge badge-light ml-1">{PskAttachmentsList.bytesToSize(file.size)}</span>
				{this.removeFileFromList !== null && <span
					class="fa fa-remove fa-2x pull-right"
					onClick={(evt) => {
						evt.preventDefault();
						evt.stopImmediatePropagation();
						this.removeFileFromList(index);
					}} />}
			</button>
		});

		return (filesView)
	}
}
