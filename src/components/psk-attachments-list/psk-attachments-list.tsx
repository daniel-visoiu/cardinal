import { Component, h, Prop } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { BindModel } from "../../decorators/BindModel";
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

@Component({
	tag: 'psk-attachments-list',
	styleUrls: [
		"../../assets/fonts/font-awesome/font-awesome.min.css",
		"../../assets/css/bootstrap/bootstrap.min.css"],
	shadow: true
})

export class PskAttachmentsList {
	@CustomTheme()
	@BindModel() modelHandler;
	@TableOfContentProperty({
		description: `This property holds the files that can be downloaded. They can be downloaded one by one by clicking on the desired file, or all at the same time.`,
		specialNote: `WgFile is a custom type. Inside it, the following information can be stored:
			name of the file,
			size of the file,
			type of the file (by extension),
			? content of the file`,
		isMandatory: true,
		propertyType: 'Array containing objects with following properties {name:string, size:number(nr_of_bytes)}'
	})
	@Prop() files;
  @TableOfContentProperty({
    description: `This property indicates if the files list could be altered by removing files from the list `,
    isMandatory: false,
    propertyType: 'boolean'
  })
  @Prop() readOnly: boolean = false;


  @TableOfContentProperty({
    description: `This property indicates if the component should render a "No attachments available" text if no files are present.`,
    isMandatory: false,
    propertyType: 'boolean'
  })
  @Prop() noAttachmentsText:string;


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
      return this.noAttachmentsText ? <h5>{this.noAttachmentsText}</h5> : null;
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
				event-data={file.name} event-name="download-attachment">
        <span class={`icon mr-1 fa ${fileType}`} /><span class="filename">{file.name}</span>
				<span class={`badge badge-light ml-1 `}>{PskAttachmentsList.bytesToSize(file.size)}</span>
        {!this.readOnly?<psk-button event-name="remove-attachment" eventData={file}>&times;</psk-button>:null}
			</psk-button>
		});

		return (filesView)
	}
}
