/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as css from '../../../base/browser/cssValue.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { getIconRegistry, IconContribution, IconFontDefinition } from '../common/iconRegistry.js';
import { IProductIconTheme, IThemeService } from '../common/themeService.js';

// ── ArcBright SVG Icons ─────────────────────────────────────────
// Minimal inline SVG definitions for ArcBright IDE icons.
// Each icon uses a 16x16 viewBox, currentColor fill, and simple paths.

const ARCTHEME_SVG_ICONS: Record<string, string> = {
	explorer: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 1.5h5l2 1.5h6v11h-13v-12.5z"/><rect x="3" y="6" width="10" height="1"/></svg>`,
	search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/></svg>`,
	git: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="5" r="1.5"/><circle cx="11" cy="11" r="1.5"/><line x1="5" y1="5" x2="11" y2="11"/><line x1="3" y1="3" x2="13" y2="13"/></svg>`,
	run: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><polygon points="4,1.5 14,8 4,14.5"/></svg>`,
	ext: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="1.5" width="5" height="5" rx="1"/><rect x="9.5" y="1.5" width="5" height="5" rx="1"/><rect x="1.5" y="9.5" width="5" height="5" rx="1"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/></svg>`,
	arcbright: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 2a6 6 0 00-6 6h6V2z"/></svg>`,
	sessions: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="8" y1="6" x2="8" y2="13"/></svg>`,
	cron: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><polyline points="8,4 8,8 11,10"/></svg>`,
	knowledge: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2.5h5l2 1h5v9h-12V2.5z"/><line x1="4" y1="7" x2="12" y2="7"/><line x1="4" y1="9.5" x2="10" y2="9.5"/></svg>`,
	terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3,4 6,8 3,12"/><line x1="8" y1="12" x2="13" y2="12"/></svg>`,
	settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5l1.5 1.5M13 3l-1.5 1.5M4.5 11.5L3 13"/></svg>`,
	wechat: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="5.5" cy="7" r="3.5"/><circle cx="10.5" cy="9" r="3"/><circle cx="4.5" cy="6.5" r=".7"/><circle cx="7" cy="6.5" r=".7"/><circle cx="10" cy="8.5" r=".6"/><circle cx="12" cy="8.5" r=".6"/></svg>`,
	feishu: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4l6 3-6 3V4z"/><path d="M8 4l6 3-6 3V4z"/></svg>`,
	telegram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="7"/><path d="M4.5 8l2 2 5-4"/></svg>`,
	voice: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="1" width="4" height="8" rx="2"/><path d="M4 6.5v1a4 4 0 008 0v-1"/><line x1="8" y1="12" x2="8" y2="15"/></svg>`,
	mic: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="0" width="4" height="7" rx="2"/><path d="M4 5.5v1.5a4 4 0 008 0v-1.5"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="4" y1="14" x2="12" y2="14"/></svg>`,
	stop: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10" rx="1"/></svg>`,
	send: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="14,2 7,9"/><path d="M14 2l-4 12-3-5-5-3z"/></svg>`,
	attach: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5V4.5L4 8.5"/><circle cx="8" cy="2.5" r="1"/></svg>`,
	tool: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="6" height="6" rx="1"/><path d="M8 8l5 5"/><circle cx="12" cy="5" r="2"/></svg>`,
	history: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><polyline points="8,4 8,8 11,10"/><path d="M3 3v4h4"/></svg>`,
	new: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></svg>`,
	file: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2.5h6l4 4v7.5H3V2.5z"/><polyline points="9,2.5 9,6.5 13,6.5"/></svg>`,
	folder: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 3.5h5l2 1h6v8H1.5V3.5z"/></svg>`,
	'folder-open': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 12.5l2-8h11l-2 8H1.5z"/><path d="M5.5 3.5l-2 8"/></svg>`,
	preview: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="3"/><path d="M1 8s3-6 7-6 7 6 7 6-3 6-7 6-7-6-7-6z"/></svg>`,
	check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,8 6.5,11.5 13,5"/></svg>`,
	warn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2L1 14h14L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r=".5" fill="currentColor"/></svg>`,
};

export function getArcThemeSvgCss(): string {
	const rules = new css.Builder();
	for (const [name, svg] of Object.entries(ARCTHEME_SVG_ICONS)) {
		const encoded = svg.replace(/#/g, '%23').replace(/"/g, '\'').replace(/</g, '%3C').replace(/>/g, '%3E');
		const dataUri = `url("data:image/svg+xml,${encoded}")`;
		rules.push(css.inline`.codicon-arc-${css.className(name)}::before { content: '' !important; display: inline-block; width: 16px; height: 16px; background: ${dataUri} center/contain no-repeat; }`);
	}
	return rules.join('\n');
}

export interface IIconsStyleSheet extends IDisposable {
	getCSS(): css.CssFragment;
	readonly onDidChange: Event<void>;
}

export function getIconsStyleSheet(themeService: IThemeService | undefined): IIconsStyleSheet {
	const disposable = new DisposableStore();

	const onDidChangeEmmiter = disposable.add(new Emitter<void>());
	const iconRegistry = getIconRegistry();
	disposable.add(iconRegistry.onDidChange(() => onDidChangeEmmiter.fire()));
	if (themeService) {
		disposable.add(themeService.onDidProductIconThemeChange(() => onDidChangeEmmiter.fire()));
	}

	return {
	dispose: () => disposable.dispose(),
	onDidChange: onDidChangeEmmiter.event,
	getCSS(): css.CssFragment {
		const productIconTheme = themeService ? themeService.getProductIconTheme() : new UnthemedProductIconTheme();
		const usedFontIds: { [id: string]: IconFontDefinition } = {};

		const rules = new css.Builder();
		const rootAttribs = new css.Builder();
		for (const contribution of iconRegistry.getIcons()) {
			const definition = productIconTheme.getIcon(contribution);
			if (!definition) {
				continue;
			}

			const fontContribution = definition.font;
			const fontFamilyVar = css.inline`--vscode-icon-${css.className(contribution.id)}-font-family`;
			const contentVar = css.inline`--vscode-icon-${css.className(contribution.id)}-content`;
			if (fontContribution) {
				usedFontIds[fontContribution.id] = fontContribution.definition;
				rootAttribs.push(
					css.inline`${fontFamilyVar}: ${css.stringValue(fontContribution.id)};`,
					css.inline`${contentVar}: ${css.stringValue(definition.fontCharacter)};`,
				);
				rules.push(css.inline`.codicon-${css.className(contribution.id)}:before { content: ${css.stringValue(definition.fontCharacter)}; font-family: ${css.stringValue(fontContribution.id)}; }`);
			} else {
				rootAttribs.push(css.inline`${contentVar}: ${css.stringValue(definition.fontCharacter)}; ${fontFamilyVar}: 'codicon';`);
				rules.push(css.inline`.codicon-${css.className(contribution.id)}:before { content: ${css.stringValue(definition.fontCharacter)}; }`);
			}
		}

		for (const id in usedFontIds) {
			const definition = usedFontIds[id];
			const fontWeight = definition.weight ? css.inline`font-weight: ${css.identValue(definition.weight)};` : css.inline``;
			const fontStyle = definition.style ? css.inline`font-style: ${css.identValue(definition.style)};` : css.inline``;

			const src = new css.Builder();
			for (const l of definition.src) {
				src.push(css.inline`${css.asCSSUrl(l.location)} format(${css.stringValue(l.format)})`);
			}
			rules.push(css.inline`@font-face { src: ${src.join(', ')}; font-family: ${css.stringValue(id)};${fontWeight}${fontStyle} font-display: block; }`);
		}

		rules.push(css.inline`:root { ${rootAttribs.join(' ')} }`);

		// Append ArcBright SVG icons
		const arcSvgCss = getArcThemeSvgCss();
		if (arcSvgCss) {
			rules.push(arcSvgCss);
		}

		return rules.join('\n');
	}
	};
}

export class UnthemedProductIconTheme implements IProductIconTheme {
	getIcon(contribution: IconContribution) {
		const iconRegistry = getIconRegistry();
		let definition = contribution.defaults;
		while (ThemeIcon.isThemeIcon(definition)) {
			const c = iconRegistry.getIcon(definition.id);
			if (!c) {
				return undefined;
			}
			definition = c.defaults;
		}
		return definition;
	}
}
