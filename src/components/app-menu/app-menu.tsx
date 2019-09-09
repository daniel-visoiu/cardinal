import {Component, h, Prop, Element, Event, EventEmitter, Listen, State} from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'app-menu',
  styleUrl: '../../themes/default/components/app-menu/app-menu.css',
  shadow: true
})
export class AppMenu {
  @CustomTheme()
  @Prop() controller: any;
  @Prop() itemRenderer?: string;
  @Prop() onMenuChanged ?: any;
  @Prop() menuItems ?: any;
  @Prop() hamburgerMaxWidth ?: number = 600;
  @State() showHamburgerMenu?: boolean = false;
  @State() showNavBar: boolean = false;
  @Element() el: HTMLElement;
  @Event({
    eventName: 'menuEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) menuItemClicked: EventEmitter;

  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;


  @Listen("resize", {capture: true, target: 'window'})
  checkIfHamburgerIsNeeded() {
    this.showHamburgerMenu = document.documentElement.clientWidth < this.hamburgerMaxWidth;
  }

  componentDidLoad() {
    this.checkIfHamburgerIsNeeded();
  }

  handleClick(ev) {
    ev.preventDefault();

    let item = ev.target.value;

    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].active = item === this.menuItems[i];
    }

    this.menuItemClicked.emit(ev.target.value);
    //forcing a rerendering
    this.menuItems = [...this.menuItems];
  }

  toggleNavBar() {
    this.showNavBar = !this.showNavBar;
  }

  componentWillLoad() {
    this.needMenuItemsEvt.emit((data) => {
      this.menuItems = data;
    });
  }


  render() {
    let ItemRendererTag = this.itemRenderer ? this.itemRenderer : "menu-item-renderer";

    let renderComponent = [];
    for (let i = 0; i < this.menuItems.length; i++) {
      renderComponent.push(<ItemRendererTag onclick={(event) => this.handleClick(event)}
                                            active={this.menuItems[i].active ? this.menuItems[i].active : false}
                                            hamburger = {this.showHamburgerMenu}
                                            value={this.menuItems[i]}/>)
    }

    if (this.showHamburgerMenu) {

      renderComponent = renderComponent.map((item) => {
        return <li onClick={this.toggleNavBar.bind(this)} class="nav-item">{item}</li>
      });

      let navBarClass = "collapse navbar-collapse " + `${this.showNavBar == true ? 'show' : ''}`;
      return (<nav class="navbar navbar-dark ">
        <a class="navbar-brand" href="#"></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" onClick={this.toggleNavBar.bind(this)}
                aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class={navBarClass}>

          <ul class="navbar-nav mr-auto">
            {renderComponent}
          </ul>

        </div>

      </nav>)
    } else {
      return renderComponent
    }
  }
}
