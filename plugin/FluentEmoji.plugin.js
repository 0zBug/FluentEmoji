/**
* @name FluentEmoji
*/

module.exports = (() => {
    const config = {
        info: {
            name: 'FluentEmoji',
            authors: [
                {
                    name: 'Bug',
                    github_username: '0zBug'
                },
            ],
            version: '1.0',
            description: 'Use microsoft fluent emojis in discord.'
        }
    };
    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        load() {
            BdApi.showConfirmationModal('Library plugin is needed', [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: 'Download',
                cancelText: 'Cancel',
                onConfirm: () => {
                    require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
                        if (error) return require('electron').shell.openExternal('https://betterdiscord.app/Download?id=9');
                        await new Promise(r => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
                        window.location.reload();
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const {
                Patcher,
                WebpackModules,
                DiscordModules: {
                    SelectedChannelStore,
                }
            } = Api;

            const EmojiParser = WebpackModules.findByUniqueProperties(['parse', 'parsePreprocessor', 'unparse']);
            const EmojiPicker = WebpackModules.findByUniqueProperties(['useEmojiSelectHandler']);
            const MessageUtilities = WebpackModules.getByProps("sendMessage");

            return class FluentEmoji extends Plugin {
                onStart() {
                    Patcher.after(EmojiParser, 'parse', (_, args, ret) => {
                        for (const emoji of ret.validNonShortcutEmojis) {
                            if (emoji.available) {
                                ret.content = ret.content.replace(emoji.surrogates, "https://raw.github.com/0zBug/FluentEmoji/main/" + emoji.name + ".gif ");
                            }
                        }

                        return ret;
                    });
                    
                    Patcher.after(EmojiPicker, 'useEmojiSelectHandler', (_, args, ret) => {
                    return function (data, state) {
                        if (state.toggleFavorite) return ret.apply(this, arguments);

                        if (!data.isDisabled) {
                                const url = "https://github.com/0zBug/FluentEmoji/blob/main/" + data.emoji.name + ".gif?raw=true"
                                
                                require('request')(url, function(err, res, body) {
                                    if (res.statusCode == 200) {
                                        MessageUtilities.sendMessage(SelectedChannelStore.getChannelId(), {
                                            content: url
                                        });
                                    } else {
                                        MessageUtilities.sendMessage(SelectedChannelStore.getChannelId(), {
                                            content: ":" + data.emoji.name + ":"
                                        });
                                    }
                                });
                            }
                        }
                    });
                }

                onStop() {
                    Patcher.unpatchAll();
                }

                getSettingsPanel() {
                    return this.buildSettingsPanel().getElement(); 
                }             
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();

/*@end@*/