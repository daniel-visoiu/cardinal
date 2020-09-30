import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { MenuItem } from '../../interfaces/MenuItem'
import CustomTheme from '../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';


@Component({
    tag: 'psk-floating-menu',
    styleUrl:"../../assets/fonts/font-awesome/font-awesome.min.css",
    shadow: true
})
export class PskFloatingMenu {
    @CustomTheme()

    @State() menuItems: MenuItem[] = [];

    @TableOfContentProperty({
        description: `This property shows the state of the backdrop on the Floating Menu and the Floating Menu itself.`,
        isMandatory: false,
        propertyType: `boolean`,
        defaultValue: `false`
    })

    @Prop({ reflect: true, mutable: true }) opened: boolean = false;

    @Event({
        eventName: "needFloatingMenu",
        bubbles: true,
        composed: true,
        cancelable: true
    }) needFloatingMenu: EventEmitter;

    componentWillLoad() {
        this.needFloatingMenu.emit((err, data) => {
            if (!err && data) {
                this.menuItems = JSON.parse(JSON.stringify(data));
            } else {
                console.error(err);
            }
        });
    }

    render() {
        return [
            <div id="backdrop" onClick={(event) => {
                event.preventDefault();
                this.opened = !this.opened;
            }}></div>,
            <div class="container">
                <ul class="items">{
                    this.menuItems.map(menuItem => {
                        return (<li onClick={() => { this.opened = !this.opened }} class="nav-item">
                            <a href={menuItem.path}>
                                {menuItem.name}
                            </a>
                        </li>)
                    })
                }
                </ul>
                <div class="toggleFloatingMenu">
                    <a href="#" class="plus"
                        onClick={(event) => {
                            event.preventDefault();
                            this.opened = !this.opened;
                        }}>
                        <span class="fa fa-plus"></span>
                    </a>
                </div>
            </div>
        ];
    }
}
