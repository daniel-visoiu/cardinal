import { Component, Element, h, State, Prop } from "@stencil/core";
import Prism from 'prismjs';
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-tag",
})

export class PskTag {
	@CustomTheme()

	@TableOfContentProperty({
		description: `This property is the title of the psk-chapter that will to be created.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() title: string = "";

	@State() componentCode: string = "";
	@Element() host: HTMLElement;

	componentWillLoad() {
		this.componentCode = this.host.innerHTML;
		let linkElement = this.host.querySelector("link");
		console.log(linkElement, this.host.innerHTML)

		if (linkElement) {
			this.host.innerHTML = linkElement.outerHTML;
			this.componentCode = this.componentCode.replace(linkElement.outerHTML, "");
			console.log(this.host.innerHTML,this.componentCode)
			linkElement && linkElement.remove();
		} else {
			this.host.innerHTML = "";
		}
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
