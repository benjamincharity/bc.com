"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var scully_1 = require("@scullyio/scully");
var scully_plugin_time_to_read_1 = require("scully-plugin-time-to-read");
var lazyImages = require("@notiz/scully-plugin-lazy-images");
var scully_plugin_minify_html_1 = require("scully-plugin-minify-html");
var scully_plugin_docs_link_update_1 = require("@scullyio/scully-plugin-docs-link-update");
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
scully_1.setPluginConfig(scully_plugin_time_to_read_1.timeToRead, {
    path: '/articles',
});
exports.config = {
    projectRoot: './apps/web/src',
    projectName: 'web',
    outDir: './dist/static',
    defaultPostRenderers: ['seoHrefOptimise', lazyImages, scully_plugin_minify_html_1.MinifyHtml, scully_plugin_docs_link_update_1.docLink],
    routes: {
        '/articles/:postId': {
            type: 'contentFolder',
            postId: {
                folder: './articles',
            },
        },
    },
};
