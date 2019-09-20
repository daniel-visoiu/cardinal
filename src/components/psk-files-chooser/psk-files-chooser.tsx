import {Component, h, Prop} from '@stencil/core';
import {WgFile} from "../../interfaces/WgFile";

@Component({
  tag: 'psk-files-chooser',
  styleUrl: './psk-files-chooser.css',
  shadow: true
})

export class PskFilesChooser {
  @Prop() label: string = "Select files";
  @Prop() accept?: string;
  @Prop() onFilesChange?: Function;
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
    return (<button type="button" class="btn btn-secondary p-0">
      <label class="pt-0 mb-0 p-2">
        {this.label}
        <input accept={this.accept} type="file" onChange={this.addedFile.bind(this)} multiple
               class="form-control-file form-control-sm"/>
      </label>
    </button>)
  }
}
