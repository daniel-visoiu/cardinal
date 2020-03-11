import { Component, h, Listen, State } from "@stencil/core";
import CustomTheme from "../../../decorators/CustomTheme";

const appMaxWidth = 960;

@Component({
	tag: 'psk-default-renderer',
	shadow: true
})

export class AppRootDefaultRender {
	@CustomTheme()

	@State() mobileLayout: boolean = false;

	@Listen("resize", { capture: true, target: 'window' })
	checkLayout() {
		this.mobileLayout = document.documentElement.clientWidth < appMaxWidth;
	}

	componentWillLoad() {
		this.checkLayout();
	}

	render() {

		let appMenuCmpt = <app-menu item-renderer="sidebar-renderer" hamburgerMaxWidth={appMaxWidth}></app-menu>;
		let versionCmpt = <div class="nav-footer">version 0.1</div>;

		let asideComponents = [];

		if (this.mobileLayout) {
			asideComponents = [<psk-user-profile profile-renderer="mobile-profile-renderer"></psk-user-profile>, appMenuCmpt]
		}
		else {
			asideComponents = [<psk-user-profile></psk-user-profile>, appMenuCmpt, versionCmpt]
		}

		return (
			<div class={`global_container ${this.mobileLayout ? "is-mobile" : ""}`}>
				<aside>
					{asideComponents}
				</aside>

				<section>
					<psk-app-router failRedirectTo="/home"></psk-app-router>
					{this.mobileLayout === true ? versionCmpt : null}
				</section>
			</div>
		);
	}
}
