import { Component, Element, h, State, Prop } from "@stencil/core";

@Component({
	tag: "psk-tag"
})

export class PskTag {

	@Prop() title: string = "";
	@State() componentCode: string = "";
	@Element() host: HTMLDivElement;

	componentWillLoad() {
		this.componentCode = this.host.innerHTML;
		this.host.innerHTML = '';
	}

	render() {
		return (
			<psk-chapter title={this.title}>
				<pre class="text-center code-tag">
					<code class="language-html code-tag" data-lang="html">
						<span class="nt">{this.componentCode}</span>
					</code>
				</pre>
			</psk-chapter>
		)
	}
}
