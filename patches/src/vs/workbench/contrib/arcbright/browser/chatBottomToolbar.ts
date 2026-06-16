/*---------------------------------------------------------------------------------------------
 *  ArcBright Chat Bottom Toolbar
 *  Attach | 推理 | 工具 toggle | cache% + ¥ cost
 *--------------------------------------------------------------------------------------------*/

import { $, append } from '../../../../base/browser/dom.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export interface IChatBottomToolbarOptions {
	cachePercent?: number;
	cost?: string;
}

export class ChatBottomToolbar extends Disposable {
	private container: HTMLElement;
	private cacheEl: HTMLElement;
	private costEl: HTMLElement;

	constructor(
		parent: HTMLElement,
		private options: IChatBottomToolbarOptions = {},
	) {
		super();
		this.container = append(parent, $('.arcbright-chat-bottom-toolbar'));

		// Attach button
		const attachBtn = append(this.container, $('.abtb-item'));
		attachBtn.innerHTML = `<svg class="abtb-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="6" r="2"/><path d="M10 8v10M4 10a6 6 0 0112 0"/></svg>`;

		append(this.container, $('.abtb-sep'));

		// 推理 toggle
		const reasonBtn = append(this.container, $('.abtb-item.abtb-reason'));
		reasonBtn.textContent = '推理';

		append(this.container, $('.abtb-sep'));

		// 工具 toggle
		const toolBtn = append(this.container, $('.abtb-item'));
		toolBtn.innerHTML = `<svg class="abtb-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="11" y="7" width="1" height="4" rx=".5"/><rect x="13" y="5" width="5" height="1" rx=".5"/><line x1="11" y1="11" x2="7" y2="15"/></svg>`;

		// Right side: cache% + cost
		const right = append(this.container, $('.abtb-right'));
		this.cacheEl = append(right, $('.abtb-cache'));
		this.cacheEl.textContent = `缓存 ${this.options.cachePercent ?? 0}%`;
		this.costEl = append(right, $('.abtb-cost'));
		this.costEl.textContent = this.options.cost ?? '¥0.00';
	}

	update(options: IChatBottomToolbarOptions): void {
		this.cacheEl.textContent = `缓存 ${options.cachePercent ?? 0}%`;
		this.costEl.textContent = options.cost ?? '¥0.00';
	}

	override dispose(): void {
		this.container.remove();
		super.dispose();
	}
}
