import { Component, Prop, h, Element, State } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { GRID_IGNORED_COMPONENTS, GRID_BREAKPOINTS } from '../../utils/constants';

interface BreakPoint {
	breakpoint: string,
	values: Array<string>
};

@Component({
	tag: "psk-grid"
})
export class PskGrid {
	@CustomTheme()

	@TableOfContentProperty({
		isMandatory: true,
		propertyType: 'number',
		description: 'This is the number of columns for the bootstrap columns class.',
		defaultValue: 'null',
		specialNote: `That number can only be an integer between 1 and 12`
	})
	@Prop() columns: number | null = null;

	@Prop() layout: string | null = null;

	@Element() _host: HTMLElement;

	@State() htmlChildren: HTMLElement | Array<HTMLElement> = [];

	render() {
		let htmlChildren: Array<Element> = Array.from(this._host.children);

		if (!this.columns || !this.layout) {
			return (
				<div class="row">
					<slot />
				</div>
			);
		}

		let mappedBoostrapRules: Array<BreakPoint> = this._createLayoutRules.call(this);

		if (mappedBoostrapRules.length === 0) {
			return (
				<div class="row">
					<slot />
				</div>
			);
		}

		let index = 0;
		htmlChildren.forEach((child: Element) => {
			if (GRID_IGNORED_COMPONENTS.indexOf(child.tagName.toLowerCase()) >= 0) {
				return;
			}
			let classList: string = '';

			mappedBoostrapRules.forEach((rule: BreakPoint) => {
				switch (rule.breakpoint) {
					case 'xs': {
						classList += this._getClass('xs', rule.values[index]);
						break;
					}
					case 's': {
						classList += this._getClass('sm', rule.values[index]);
						break;
					}
					case 'm': {
						classList += this._getClass('md', rule.values[index]);
						break;
					}
					case 'l': {
						classList += this._getClass('lg', rule.values[index]);
						break;
					}
					default: break;
				}
			});

			child.className = `${child.className} ${classList}`;
			index = (index + 1) % this.columns;
		});

		return (
			<div class="row">
				<slot />
			</div>
		);
	}

	_getClass(bkpt: string, value: string) {
		let classes: string = '';

		switch (value) {
			case "auto": break;
			case "0": {
				classes += `hidden-${bkpt} `;
				break;
			}
			default: {
				classes += `col-${bkpt}-${value} `;
				break;
			}
		}

		return classes;
	}

	_createLayoutRules() {
		let self = this;
		let breakpointsSet = this.layout.split("\]")
			.map(function (rule) {
				return `${rule.trim().toLowerCase()}]`;
			});

		let filteredBreakpoints = breakpointsSet.filter(function (rule) {
			let _split = rule.split('=');

			if (_split.length === 0) {
				return false;
			}

			if (GRID_BREAKPOINTS.indexOf(_split[0].trim()) === -1) {
				return false;
			}

			let values = _split[1].replace("\[", "").replace("\]", "")
				.split(",").map(function (value) {
					return value.trim();
				})
				.filter(function (value) {
					if (value === 'auto') {
						return true;
					}
					if (parseInt(value) < 13 && parseInt(value) >= 0) {
						return true;
					}
					return false;
				});

			if (values.length !== self.columns) {
				return false;
			}

			return true;
		})

		let breakpoints = filteredBreakpoints.map(function (rule) {
			let _split = rule.split('=');
			let breakpoint = _split[0].trim();
			let values = _split[1].replace("\[", "").replace("\]", "")
				.split(",").map(function (value) {
					return value.trim();
				});

			return {
				breakpoint: breakpoint,
				values: values
			};
		});

		return breakpoints;
	}
}
