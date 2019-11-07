import { Component, Element, h, State, Prop } from "@stencil/core";
import Prism from 'prismjs';

@Component({
	tag: "psk-tag",
	styleUrl: './highlight.css'
})

export class PskTag {

	@Prop() title: string = "";

	@State() componentCode: string = "";
	@Element() host: HTMLDivElement;

	componentWillLoad() {
		this.componentCode = this.host.innerHTML;
		this.host.innerHTML = '';
	}

	componentDidLoad() {
		Prism.highlightAllUnder(this.host);
	}

	render() {

		const sourceCode = (
			<pre class="text-center">
				<code class="language-html" data-lang="html">
					{this.componentCode}
				</code>
			</pre>
		);

		if (this.title.replace(/\s/g, '') === '') {
			return <div>{sourceCode}</div>;
		}

		return <psk-chapter title={this.title}>{sourceCode}</psk-chapter>;
	}
}