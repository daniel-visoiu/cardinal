import { Component, h, Prop, Element } from "@stencil/core";
// import { TOOLTIP_TEXT, TOOLTIP_COPIED_TEXT } from "../../decorators/declarations/constants";

@Component({
	tag: "psk-card",
	styleUrl: './page.css'
})

export class PskCard {

	@Prop() title: string = "";
	@Prop() id: string = "";
	@Element() private element: HTMLElement;

	_copyToClipboardHandler(clipboardText: string): void {
		try {
			const copyInput: HTMLInputElement = document.createElement('input');
			this.element.appendChild(copyInput);
			copyInput.setAttribute('value', clipboardText);

			copyInput.select();
			copyInput.setSelectionRange(0, 99999);

			document.execCommand("copy");

			window.location.href = clipboardText;
			// this.element.querySelector('#tooltip').innerHTML = TOOLTIP_COPIED_TEXT
			this.element.removeChild(copyInput);
		} catch (err) {
			console.error(err);
		}
	}

	_resetTooltip(): void {
		// this.element.querySelector('#tooltip').innerHTML = TOOLTIP_TEXT
	}

	_isCopySupported(): boolean {
		let support: boolean = !!document.queryCommandSupported;

		['copy', 'cut'].forEach((action) => {
			support = support && !!document.queryCommandSupported(action);
		});
		return support;
	}

	render() {

		const elementId = this.id.trim().replace(/ /g, "_").toLowerCase();
		let clipboardLink = null;
		if (elementId.length > 0 && this._isCopySupported()) {
			clipboardLink = [
				<span>
					<a class="mark"
						href={`#${elementId}`}
						onClick={(evt: MouseEvent) => {
							evt.preventDefault();
							evt.stopImmediatePropagation();
							this._copyToClipboardHandler(`${window.location.href}?id=${elementId}`);
						}}
						onMouseOut={() => {
							this._resetTooltip();
						}} >#</a>
				</span>,
				// <span class="tooltiptext" id="tooltip">{TOOLTIP_TEXT}</span>
			];
		}

		let cardHeader = null;
		if (this.title) {
			cardHeader = (
				<div class="card-header">
					<h5>
						{this.title}
						{clipboardLink}
					</h5>
				</div>
			);
		}

		return (
			<div class="card psk-card" id={elementId}>
				{cardHeader}
				<div class="card-body">
					<slot />
				</div>
			</div>
		)
	}
}
