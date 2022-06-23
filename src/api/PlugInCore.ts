// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {
    
    export abstract class PluginCore implements IPlugin {

      
        /* DON'T CHANGE ANYTHING BELOW UNLESS YOU KNOW WHAT YOU ARE DOING */

        public isDefault = true;
        currentFolder: IItem;
        popupModeOrControl: boolean;
        public projectSettings:IProjectSettings;

        static PLUGIN_NAME = "<PLUGIN_NAME_PLACEHOLDER>";
        static PLUGIN_VERSION = "<PLUGIN_VERSION_PLACEHOLDER>";

        constructor() {
            console.debug(`Constructing ${Plugin.PLUGIN_NAME}`);
        }


        initProject(project:string) {
            this.onInitProject(project);
        }
        // to be overwritten
        abstract onInitProject(project:string); // eslint-disable-line
        

        initItem(_item: IItem, _jui: JQuery) {
            if (_item.id.indexOf("F-") == 0) {
                this.currentFolder = _item;
                this.popupModeOrControl = true;
            } else {
                this.currentFolder = undefined;
                this.popupModeOrControl = false;
            }
            this.onInitItem(_item);
        }
        // to be overwritten
        abstract onInitItem(_item: IItem);


        static canBeDisplay(_cat: string): boolean {
            return true;
        }

        // by default plugins add none or one item to the tool menu of displayed items. This class can be overwritten if needed
        updateMenu(ul: JQuery, _hook: number) {
            if (Plugin.config.menuToolItem.enabled) {
                const li = $(`<li><a>${Plugin.config.menuToolItem.title}</a></li>`).on("click", () => {
                    const m = new Tool();
                    m.menuClicked();
                });
                ul.append(li);
          }  
        }

        // this method is called to see if a plugin defines or overwrites a field type
        supportsControl(fieldType: string): boolean {
            return fieldType == Plugin.config.field.fieldType && Plugin.config.field.enabled;
        }
        
        // this method calls the content of the Control function
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
                return [<ISettingPage>
                    {
                        id: Plugin.config.projectSettingsPage.id,
                        title: Plugin.config.projectSettingsPage.title,
                        type:Plugin.config.projectSettingsPage.id,
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
                return [<ISettingPage> {
                        id: Plugin.config.customerSettingsPage.id,
                        title: Plugin.config.customerSettingsPage.title,
                         type:Plugin.config.projectSettingsPage.id,
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