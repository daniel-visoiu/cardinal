import { Component, h, Listen, State, Prop } from "@stencil/core";
import CustomTheme from "../../../decorators/CustomTheme";
import { RouterHistory, injectHistory } from "@stencil/router";

const appMaxWidth = 650;

@Component({
	tag: 'psk-default-renderer',
	shadow: true
})

export class AppRootDefaultRender {

	@CustomTheme()

	@Prop() history: RouterHistory;

	@State() mobileLayout: boolean = false;

	@Listen("resize", { capture: true, target: 'window' })
	checkLayout() {
		this.mobileLayout = document.documentElement.clientWidth < appMaxWidth;
	}

	componentWillLoad() {
		this.checkLayout();
	}

	render() {
		return (
			<div class={`global_container ${this.mobileLayout ? "is-mobile" : ""}`}>
				<aside>
					<psk-user-profile />

					<app-menu item-renderer="sidebar-renderer" hamburgerMaxWidth={appMaxWidth}></app-menu>
					{this.mobileLayout === false ? <div class="nav-footer">version 0.1</div> : null}
				</aside>

				<section>
					<psk-app-router />
					{this.mobileLayout === true ? <div class="nav-footer bottom-stick">version 0.1</div> : null}
				</section>
			</div>
		);
	}
}

injectHistory(AppRootDefaultRender);