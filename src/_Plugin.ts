/// <reference path="api/Matrix.Labels.ts" />

// eslint-disable-next-line no-unused-vars
namespace BoilerPlate {
    
    export class Plugin implements IPlugin {

        // Define the plugin configuration in the following object. See interface comments for explanation
        static config: IPluginConfig = {
            customerSettingsPage: {
                id: "BPP_projectsettings",
                title: "BPP projectsettings page",
                enabled: true,
                defaultSettings: {
                    content: "boiler plate",
                },
                settingName: "BPP_settings",
                help: "This is my help text",
                helpUrl:"https://docs23.matrixreq.com"
            },
            projectSettingsPage: {
                id: "BPP_projectsettings",
                title:"BPP projectsettings page",
                enabled: true,
                defaultSettings: {
                    content: "boiler plate",
                },
                settingName: "BPP_settings",
                help: "This is my help text",
                helpUrl:"https://docs23.matrixreq.com"
            },
            menuToolItem: {
                enabled: true,
                title:"matrix-ui-plugin-boilerplate-menuitem",
            },
            field: {
                enabled: true,
                fieldType: "matrix-ui-plugin-boilerplate",
                defaultValue: "Default value",
                title: "matrix-ui-plugin-boilerplate-field",
                fieldConfigOptions: {
                    id: "matrix-ui-plugin-boilerplate",
                    capabilities: {
                        canBePublished: false,
                        canBeReadonly: true,
                        canBeXtcPreset: false,
                        canHideInDoc: false,
                        canBeUsedInDocs: false,
                        canRequireContent: true,
                    },
                    class: "",
                    help: "",
                    label: "matrix-ui-plugin-boilerplate-field",
                },
                defaultParameters: {
                    fieldParameter: "matrix-ui-plugin-boilerplate-field",
                }
            },
            dashboard: {        
                
                id:"BPP",
                title: "BPP dashboard page",
                enabled: true,
                icon: "fal fa-cog",
                parent: "DASHBOARDS",
                usefilter: true,
                order: 9999,
            }
        };

        /* DON'T CHANGE ANYTHING BELOW UNLESS YOU KNOW WHAT YOU ARE DOING */

        public isDefault = true;
        currentFolder: IItem;
        popupModeOrControl: boolean;

        static PLUGIN_NAME = "<PLUGIN_NAME_PLACEHOLDER>";
        static PLUGIN_VERSION = "<PLUGIN_VERSION_PLACEHOLDER>";

        constructor() {
            console.debug(`Contructing ${Plugin.PLUGIN_NAME}`);
        }

        initItem(_item: IItem, _jui: JQuery) {
            if (_item.id.indexOf("F-") == 0) {
                this.currentFolder = _item;
                this.popupModeOrControl = true;
            } else {
                this.currentFolder = undefined;
                this.popupModeOrControl = false;
            }
        }
        static canBeDisplay(_cat: string): boolean {
            return true;
        }

        updateMenu(ul: JQuery, _hook: number) {
            if (Plugin.config.menuToolItem.enabled) {
                const li = $(`<li><a>${Plugin.config.menuToolItem.title}</a></li>`).on("click", () => {
                    const m = new Tool();
                    m.menuClicked();
                });
                ul.append(li);
          }  
        }
        supportsControl(fieldType: string): boolean {
            return fieldType == Plugin.config.field.fieldType && Plugin.config.field.enabled;
        }
        createControl(ctrlObj: JQuery, settings: IBaseControlOptions) {
            if (settings && settings.fieldType == Plugin.config.field.fieldType &&  Plugin.config.field.enabled){
                const baseControl = new Control(ctrlObj);
                ctrlObj.getController = () => {
                    return baseControl;
                };
                baseControl.init(<IControlOptions>settings);
            }
        }

        getFieldConfigOptions(): IFieldDescription[] {
            return [
                Plugin.config.field.fieldConfigOptions
            ];
        }
        isEnabled() {
            return true;
        }
        getPluginName() {
            return Plugin.PLUGIN_NAME;
        }

        getPluginVersion() {
            return Plugin.PLUGIN_VERSION;
        }
        getProjectSettingPages(): ISettingPage[] {
            const pbpi = ProjectSettingsPage();
            if (!Plugin.config.projectSettingsPage.enabled)
                return [];
            else
                return [
                    {
                        id: Plugin.config.projectSettingsPage.id,
                        title: Plugin.config.projectSettingsPage.title,
                        render: (_ui: JQuery) => {
                            pbpi.renderSettingPage();
                        },
                        saveAsync: () => {
                            return pbpi.saveAsync();
                        },
                    },
                ];
        }
        getCustomerSettingPages(): ISettingPage[] {
            const pbpi = ServerSettingsPage();
            if (!Plugin.config.customerSettingsPage.enabled)
                return [];
            else
                return [
                    {
                        id: Plugin.config.customerSettingsPage.id,
                        title: Plugin.config.customerSettingsPage.title,
                        render: (_ui: JQuery) => {
                            pbpi.renderSettingPage();
                        },
                        saveAsync: () => {
                            return pbpi.saveAsync();
                        },
                    },
                ];
        }

        getProjectPages(): IProjectPageParam[] {
            const pages: IProjectPageParam[] = [];
            if (Plugin.config.dashboard.enabled) {
                pages.push({
                    id: Plugin.config.dashboard.id,
                    title: Plugin.config.dashboard.title,
                    folder: Plugin.config.dashboard.parent,
                    order: Plugin.config.dashboard.order,
                    icon: Plugin.config.dashboard.icon,
                    usesFilters: true,
                    render: (_options: IPluginPanelOptions) => {
                        const gd = new DashboardPage();
                        gd.renderProjectPage();
                    },
                });
           }
               
            return pages;
        }
    }
}

// Register the plugin
$(function () {
    plugins.register(new BoilerPlate.Plugin());
});

