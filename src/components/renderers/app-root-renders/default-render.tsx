import {Component, h, Listen, Prop, State} from "@stencil/core";
import {HistoryType} from "@stencil/router/dist/types/global/interfaces";
import CustomTheme from "../../../decorators/CustomTheme";

const appMaxWidth = 650;

@Component({
  tag: 'psk-default-renderer',
  styleUrl: '../../../../themes/default/components/psk-default-renderer/psk-default-renderer.css',
  shadow: true
})

export class AppRootDefaultRender {
  @CustomTheme()
  @State() mobileLayout: boolean = false;
  @Prop() historyType: HistoryType;

  @Listen("resize", {capture: true, target: 'window'})
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
          <psk-user-profile></psk-user-profile>
          <app-menu item-renderer="sidebar-renderer" hamburgerMaxWidth={appMaxWidth}></app-menu>
          {this.mobileLayout === false ? <div class="nav-footer">version 0.1</div> : null}
        </aside>

        <section>
          <psk-app-router failRedirectTo="/home" historyType={this.historyType}></psk-app-router>
          {this.mobileLayout === true ? <div class="nav-footer bottom-stick">version 0.1</div> : null}
        </section>
      </div>
    );
  }
}
