import { Component, h, Prop } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { BindModel } from "../../decorators/BindModel";
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

@Component({
	tag: 'psk-attachments-list',
	styleUrls: [
		"../../../themes/commons/fonts/font-awesome.min.css",
		"../../../themes/commons/bootstrap/css/bootstrap.min.css"],
	shadow: true
})

export class PskAttachmentsList {
	@CustomTheme()
	@BindModel() modelHandler;
	@TableOfContentProperty({
		description: `This parameter holds the files that can be downloaded. They can be downloaded one by one by clicking on the desired file, or all at the same time.`,
		specialNote: `WgFile is a custom type. Inside it, the following information can be stored:
			name of the file,
			size of the file,
			type of the file (by extension),
			? content of the file`,
		isMandatory: true,
		propertyType: 'array of WgFile items (WgFile[])'
	})
	@Prop() files;

	@Prop() attachmentsClass: string = "";

	static bytesToSize(bytes) {
		if (bytes == 0) return '0 Byte';
		let sizeIndex = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
		return Math.round(bytes / Math.pow(1024, sizeIndex)) + ' ' + sizes[sizeIndex];
	}

	render() {
	  if(!Array.isArray(this.files)){
	    return null;
    }

		if (this.files.length === 0) {
			return <h5>No attachments available!</h5>;
		}

		let filesView = this.files.map((file) => {

			let fileType = null;
			switch (file.name.substr(file.name.lastIndexOf(".") + 1)) {
				case "pdf":
					fileType = "fa-file-pdf-o";
					break;
				case "xls":
					fileType = "fa-file-excel-o";
					break;
				case "doc":
				case "docx":
					fileType = "fa-file-word-o";
					break;
				case "jpg":
				case "png":
					fileType = "fa-file-picture-o";
					break;
				default:
					fileType = "fa-file-o";
			}
			return <psk-button button-class={`btn btn-primary mr-2 mt-2 ${this.attachmentsClass}`}
				event-data={file.name} event-name="download-file">
				<span class={`icon mr-1 fa ${fileType}`} />{file.name}
				<span class={`badge badge-light ml-1 `}>{PskAttachmentsList.bytesToSize(file.size)}</span>
				<psk-button event-name="remove-attachment" event-data={file.name}>&times;</psk-button>
			</psk-button>
		});

		return (filesView)
	}
}
