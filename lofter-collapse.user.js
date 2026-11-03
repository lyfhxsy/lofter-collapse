// ==UserScript==
// @name         LOFTER 作者页文章收起 / 展开
// @namespace    local.lofter.collapse
// @version      1.0.0
// @description  作者页长文默认显示预览，可原地展开和收起；保留标签、评论、热度及翻页。
// @match        https://*.lofter.com/*
// @match        http://*.lofter.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';

    // 预览高度（像素），可按喜好修改。
    const PREVIEW_HEIGHT = 240;

    // 仅处理作者文章列表，单篇详情页和归档页不折叠。
    if (/^\/(?:post|view)(?:\/|$)/.test(location.pathname)) return;
    if (document.getElementById('lf-collapse-style')) return;

    const style = document.createElement('style');
    style.id = 'lf-collapse-style';
    style.textContent = `
        .lf-collapse-preview {
            max-height: ${PREVIEW_HEIGHT}px !important;
            overflow: hidden !important;
            position: relative;
        }
        .lf-collapse-preview::after {
            content: '';
            position: absolute;
            inset: auto 0 0;
            height: 24px;
            pointer-events: none;
            background: linear-gradient(transparent, rgba(128,128,128,.12));
        }
        button.lf-collapse-button {
            display: block !important;
            box-sizing: border-box;
            width: 100%;
            margin: 10px 0 !important;
            padding: 8px 12px !important;
            border: 1px solid rgba(128,128,128,.35) !important;
            border-radius: 5px;
            background: rgba(128,128,128,.07) !important;
            color: inherit !important;
            font: inherit !important;
            font-size: 13px !important;
            line-height: 1.6 !important;
            text-align: center;
            cursor: pointer;
        }
        button.lf-collapse-button:hover { background: rgba(128,128,128,.16) !important; }
        button.lf-collapse-button:focus-visible { outline: 2px solid #519a75; outline-offset: 2px; }
        button.lf-collapse-button[hidden] { display: none !important; }
    `;
    document.head.append(style);

    let nextId = 0;
    function scan() {
        // 已在示例作者页确认的模板结构，避免误折叠侧栏或整页。
        document.querySelectorAll('.block.article > .main > .content').forEach(content => {
            if (content.dataset.lfCollapsible || content.scrollHeight <= PREVIEW_HEIGHT + 40) return;
            content.dataset.lfCollapsible = 'true';
            if (!content.id) content.id = `lf-collapse-content-${++nextId}`;

            const top = document.createElement('button');
            top.type = 'button';
            top.className = 'lf-collapse-button';
            top.setAttribute('aria-controls', content.id);

            const bottom = top.cloneNode(false);
            bottom.textContent = '收起正文 ↑';
            let expanded = false;

            function render() {
                content.classList.toggle('lf-collapse-preview', !expanded);
                top.textContent = expanded ? '收起正文 ↑' : '展开全文 ↓';
                top.setAttribute('aria-expanded', String(expanded));
                bottom.setAttribute('aria-expanded', String(expanded));
                bottom.hidden = !expanded;
            }

            top.addEventListener('click', () => {
                expanded = !expanded;
                render();
            });
            bottom.addEventListener('click', () => {
                const needsScroll = top.getBoundingClientRect().top < 0;
                expanded = false;
                render();
                // 从长文底部收起后，回到这篇文章的按钮，避免丢失位置。
                if (needsScroll) top.scrollIntoView({ block: 'start' });
                top.focus({ preventScroll: true });
            });

            content.before(top);
            content.after(bottom);
            render();
        });
    }

    scan();
    // 兼容后续插入的文章，以及图片加载后才变长的内容。
    let pending = false;
    function scheduleScan() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            scan();
        });
    }
    new MutationObserver(scheduleScan).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('load', scheduleScan, true);
})();
