/*---------------------------------------------------------------------------------------------
 *  ArcBright Hermes Activity Bar contribution
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IViewContainersRegistry, IViewsRegistry, ViewContainer, ViewContainerLocation, Extensions as ViewExtensions } from '../../../common/views.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { localize2 } from '../../../../nls.js';

// ── View Container IDs ──────────────────────────────────────────
export const HERMES_AGENT_ID = 'hermes-agent';
export const HERMES_SESSIONS_ID = 'hermes-sessions';
export const HERMES_CRON_ID = 'hermes-cron';
export const HERMES_USAGE_ID = 'hermes-usage';
export const HERMES_KNOWLEDGE_ID = 'hermes-knowledge';

const containers: { id: string; title: string; mnemonic: string; order: number }[] = [
	{ id: HERMES_AGENT_ID, title: 'AI 对话', mnemonic: 'AI', order: 6 },
	{ id: HERMES_SESSIONS_ID, title: '会话列表', mnemonic: 'Sessions', order: 7 },
	{ id: HERMES_CRON_ID, title: '定时任务', mnemonic: 'Cron', order: 8 },
	{ id: HERMES_USAGE_ID, title: '用量统计', mnemonic: 'Usage', order: 9 },
	{ id: HERMES_KNOWLEDGE_ID, title: '知识库', mnemonic: 'KB', order: 10 },
];

const viewContainersRegistry = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry);
const viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);

for (const c of containers) {
	const vc: ViewContainer = viewContainersRegistry.registerViewContainer({
		id: c.id,
		title: localize2(c.id, c.title),
		ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [c.id, { mergeViewWithContainerWhenSingleView: true }]),
		storageId: c.id,
		hideIfEmpty: false,
		order: c.order,
	}, ViewContainerLocation.Sidebar, { doNotRegisterOpenCommand: true });

	viewsRegistry.registerViews([{
		id: `${c.id}.default`,
		name: localize2(`${c.id}.default`, c.title),
		canToggleVisibility: true,
		canMoveView: true,
		ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [c.id, { mergeViewWithContainerWhenSingleView: true }]),
	}], vc);
}
