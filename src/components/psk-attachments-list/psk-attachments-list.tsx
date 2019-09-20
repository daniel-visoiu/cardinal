import {Component, h, Prop} from '@stencil/core';
import {WgFile} from "../../interfaces/WgFile";
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

@Component({
  tag: 'psk-attachments-list',
  styleUrl: './psk-attachments-list.css',
  shadow: true
})

export class PskAttachmentsList {
  @Prop() files: WgFile[] = [];

  static bytesToSize(bytes) {
    if (bytes == 0) return '0 Byte';
    let sizeIndex = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, sizeIndex)) + ' ' + sizes[sizeIndex];
  }

  render() {
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
          fileType = "fa-file-word-o";
          break;
        case "jpg":
        case "png":
          fileType = "fa-file-picture-o";
          break;
        default:
          fileType = "fa-file-o";
      }

      return <button type="button" class="btn btn-primary mr-1 mt-1">
        <span class={`icon mr-1 fa ${fileType}`}/>{file.name}
        <span class="badge badge-light ml-1">{PskAttachmentsList.bytesToSize(file.size)}</span></button>
    });

    return (filesView)
  }
}
