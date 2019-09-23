import {Component, h, Prop, Element, Event, EventEmitter, Listen, State} from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";
import {MenuItem} from "../../interfaces/MenuItem";

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
  @Prop() menuItems ?: MenuItem[]=[];
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


  renderItem(menuItem){
    let ItemRendererTag = this.itemRenderer ? this.itemRenderer : "psk-menu-item-renderer";

    let children = [];

    if(menuItem.children){
      for (let i = 0; i < menuItem.children.length; i++) {
        children.push(this.renderItem(menuItem.children[i]))
      }
    }
    return <ItemRendererTag onclick={(event) => this.handleClick(event)}
                            active={menuItem.active ? menuItem.active : false}
                            children={children}
                            hamburger = {this.showHamburgerMenu}
                            value={menuItem}/>
  }

  render() {


    let renderComponent = [];
    for (let i = 0; i < this.menuItems.length; i++) {
      let menuItem = this.menuItems[i];
      renderComponent.push(this.renderItem(menuItem));
    }

    let activeItem = this.menuItems.find((item)=>{
      return item.active;
    });

    if (this.showHamburgerMenu) {

      renderComponent = renderComponent.map((item) => {
        return <li onClick={this.toggleNavBar.bind(this)} class="nav-item">{item}</li>
      });

      let navBarClass = "collapse navbar-collapse " + `${this.showNavBar == true ? 'show' : ''}`;
      return (<nav class="navbar navbar-dark ">
        <a class="navbar-brand" href="#">{activeItem?activeItem.name:"Home"}</a>
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
