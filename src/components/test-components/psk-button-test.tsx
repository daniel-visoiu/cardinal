import { Component, h } from '@stencil/core';

@Component({
	tag: 'psk-button-test',
	styleUrl: "../../../themes/commons/bootstrap/css/bootstrap.css",
	shadow: true
})

export class PskButton {


	render() {
		return (
      <psk-label-test color='red'
                      first-label="@navigationLinks.0.label"
                      second-label="@navigationLinks.1.label"
                      third-label="@navigationLinks.2.label"
                      label-value="@navigationLinks.3.label"
      ></psk-label-test>
		);
	}





}
