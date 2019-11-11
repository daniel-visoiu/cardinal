import { Component, h, Prop } from '@stencil/core';
import { MenuItem } from '../../interfaces/MenuItem'
import CustomTheme from '../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';


@Component({
    tag: 'psk-floating-menu',
    shadow: true
})
export class FloatingMenu {
    @CustomTheme()

    @TableOfContentProperty({
        description:`This property represents the elements that should be rendered in a Floating Menu.`,
        isMandatory: true,
        propertyType: `Array of MenuItem(MenuItem[])`
    })
    @Prop() menuItems: MenuItem[];

    @TableOfContentProperty({
        description: `This property shows the state of the backdrop on the Floating Menu and the Floating Menu itself.`,
        isMandatory: false,
        propertyType: `boolean`,
        defaultValue: `false`
    })

    @Prop({ reflectToAttr: true, mutable: true }) opened: boolean = false;
    render() {
        console.log(this.menuItems);
        console.log(this.opened)
        return [
            <div id="backdrop" onClick={(event) => {
                event.preventDefault();
                this.opened = !this.opened;
            }}></div>,
            <div class="container">
                <ul class="items">
                    {
                        this.menuItems.map(menuItem => {
                            // return <li>
                                {/* <wg-anchor
                                    label={menuItem.label}
                                    href={menuItem.href} /> */}
                            <li onClick={() => {this.opened= !this.opened}} class="nav-item">{menuItem}</li>
                            {/* </li>; */}
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