// ==UserScript==
// @name FluentEmoji
// @author Bug
// @description Use microsoft fluent emojis on discord
// @version 1.0
// @match https://*.discord.com/*
// @grant GM.xmlHttpRequest
// ==/UserScript==

(function() {
'use strict';

var Discord;
var Utils = {
    Log: (message) => { console.log(`%c[FreeEmojis] %c${message}`, `color:#0cf;font-weight:bold`, "") },
    Warn: (message) => { console.warn(`%c[FreeEmojis] %c${message}`, `color:#0cf;font-weight:bold`, "") },
    Error: (message) => { console.error(`%c[FreeEmojis] %c${message}`, `color:#0cf;font-weight:bold`, "") },
    Webpack: function() {
        if(this.cachedWebpack) return this.cachedWebpack;

        let webpackExports;

        if(typeof BdApi !== "undefined" && BdApi?.findModuleByProps && BdApi?.findModule) {
            return this.cachedWebpack = { findModule: BdApi.findModule, findModuleByUniqueProperties: (props) => BdApi.findModuleByProps.apply(null, props) };
        }

        else if(Discord.window.webpackChunkdiscord_app != null) {
            const ids = ['__extra_id__'];
            Discord.window.webpackChunkdiscord_app.push([ids, {}, (req) => {
                webpackExports = req;
                ids.length = 0;
            }]);
        }

        else if(Discord.window.webpackJsonp != null) {
            webpackExports = typeof(Discord.window.webpackJsonp) === 'function' ? Discord.window.webpackJsonp(
                [], {'__extra_id__': (module, _export_, req) => {_export_.default = req}}, ['__extra_id__']
            ).default : Discord.window.webpackJsonp.push([
                [], {'__extra_id__': (_module_, exports, req) => { _module_.exports = req }}, [['__extra_id__']]
            ]);

            delete webpackExports.m['__extra_id__'];
            delete webpackExports.c['__extra_id__'];
        }
        else return null;

        const findModule = (filter) => {
            for(let i in webpackExports.c) {
                if(webpackExports.c.hasOwnProperty(i)) {
                    let m = webpackExports.c[i].exports;

                    if(!m) continue;
                    if(m.__esModule && m.default) m = m.default;
                    if(filter(m)) return m;
                }
            }

            return null;
        };

        const findModuleByUniqueProperties = (propNames) => findModule(module => propNames.every(prop => module[prop] !== undefined));

        return this.cachedWebpack = { findModule, findModuleByUniqueProperties };
    }
};


var emojis = {};

GM.xmlHttpRequest({
    method: "GET",
    url: "https://api.github.com/repos/0zBug/FluentEmoji/contents",
    onload: function(response) {
        if (response.status == 200) {
            var data = eval(response.responseText)

            for (var i = 0; i < data.length; i++) {
                var emoji = data[i]

                emojis[emoji.name.substring(0, emoji.name.length - 4)] = 1
            }
        }
    }
})

function Init(final) {
    Discord = { window: (typeof(unsafeWindow) !== 'undefined') ? unsafeWindow : window };

    const webpackUtil = Utils.Webpack();
    if(webpackUtil == null) { if(final) Utils.Error("Webpack not found."); return 0; }
    const { findModule, findModuleByUniqueProperties } = webpackUtil;

    let emojisModule = findModuleByUniqueProperties([ 'getDisambiguatedEmojiContext', 'searchWithoutFetchingLatest' ]);
    if(emojisModule == null) { if(final) Utils.Error("emojisModule not found."); return 0; }

    let messageEmojiParserModule = findModuleByUniqueProperties([ 'parse', 'parsePreprocessor', 'unparse' ]);
    if(messageEmojiParserModule == null) { if(final) Utils.Error("messageEmojiParserModule not found."); return 0; }

    let emojiPickerModule = findModuleByUniqueProperties([ 'useEmojiSelectHandler' ]);
    if(emojiPickerModule == null) { if(final) Utils.Error("emojiPickerModule not found."); return 0; }

    const original_searchWithoutFetchingLatest = emojisModule.searchWithoutFetchingLatest;
    emojisModule.searchWithoutFetchingLatest = function() {
        let result = original_searchWithoutFetchingLatest.apply(this, arguments);
        result.unlocked.push(...result.locked);
        result.locked = [];
        return result;
    }

    const original_parse = messageEmojiParserModule.parse;
    messageEmojiParserModule.parse = function() {
        let result = original_parse.apply(this, arguments);

        let validNonShortcutEmojis = result.validNonShortcutEmojis;
        for (let i = 0; i < validNonShortcutEmojis.length; i++) {
            const emoji = validNonShortcutEmojis[i];

            if (emojis[emoji.name] == 1) {
                result.content = result.content.replace(emoji.surrogates, "https://raw.github.com/0zBug/FluentEmoji/main/" + emoji.name + ".gif");
            }
        }

        return result
    };

    const original_useEmojiSelectHandler = emojiPickerModule.useEmojiSelectHandler;
    emojiPickerModule.useEmojiSelectHandler = function(args) {
		const { onSelectEmoji, closePopout } = args;
		const originalHandler = original_useEmojiSelectHandler.apply(this, arguments);
		return function(data, state) {
			if(state.toggleFavorite)
				return originalHandler.apply(this, arguments);

			const emoji = data.emoji;
			if(emoji != null) {
				onSelectEmoji(emoji, state.isFinalSelection);
				if(state.isFinalSelection) closePopout();
			}
		};
    };

    Utils.Log("loaded");

    return 1;
}


var InitFails = 0;
function TryInit()
{
    if(Init() !== 0) return;

    window.setTimeout((++InitFails === 600) ? Init : TryInit, 100, true);
};


TryInit();

})();
