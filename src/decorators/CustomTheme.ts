import { getElement } from "@stencil/core";
import { ComponentInterface } from "@stencil/core/dist/declarations";
import { BUILD } from "@stencil/core/build-conditionals";

declare type MyDecoratorResult = (
	target: ComponentInterface,
	methodName: string
) => void;


export default function CustomTheme(): MyDecoratorResult {
	return (proto: ComponentInterface) => {
		BUILD.cmpDidLoad = true;
		BUILD.cmpDidUnload = true;
		const { connectedCallback } = proto;

		proto.connectedCallback = function () {
			const host = getElement(this);
			if (!host) {
				//current component does not have a shadow dom.
				return;
			}
			let componentName = host.tagName.toLowerCase();
			// @ts-ignore
			if (typeof globalConfig !== "undefined" && typeof globalConfig.theme === "string") {
				// @ts-ignore
				let themeStylePath = "/themes/" + globalConfig.theme + "/components/" + componentName + "/" + componentName + ".css";
				var styleElement = document.createElement("link");
				styleElement.setAttribute("rel", "stylesheet");
				styleElement.setAttribute("href", themeStylePath);
				if (host.shadowRoot) {
					host.shadowRoot.prepend(styleElement);
				}
			}
			else {
				console.error("Theme or globalConfig is not defind!");
			}

			return connectedCallback && connectedCallback.call(this);
		};
	};
}
