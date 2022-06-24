// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {
    
    /** this is info delivered by the UI when rendering the control */
    export interface IControlOptions extends IBaseControlOptions{
        placeholder:string
        controlState?:ControlState, 
        canEdit?: boolean, 
        help?: string,
        fieldType?:string,
        fieldId?:number,
        valueChanged?: () => unknown, 
        parameter?: IFieldParameter,
        fieldValue?:unknown, // value as stored in DB
        fieldValueJSON?:unknown, // same as json (if value is a JSON object)
        isItem?:boolean,
        item?:IItem,
        isForm?:boolean,
        isPrint?:boolean,
        isTooltip?:boolean,
        id?:string,
        isHistory?:number, // version shown (if known)
        type?:string,
        isFolder?:boolean,
    }
    
     /** Description of the current plugin. Each feature can be activated/deactivated using the configuration object */
     export interface IPluginConfig {
        /** Field. This will add a new field type that can be used for data rendering in the main app */
        field: IPluginFeatureField ,
        /** Menu tool item. This will add a new menu item in the tools menu  in the main app.*/
        menuToolItem: IPluginFeatureBase,
        /** Menu tool item. This will add a new dashboard in the main app.*/
        dashboard: IPluginFeatureDashboard,

        /** Customer setting page parameter. This will add a page in the server config in the adminConfig */
        customerSettingsPage: IPluginFeature<IServerSettings>,
        /** project setting page parameter. This will add a page per project in the adminConfig */
        projectSettingsPage: IPluginFeature<IProjectSettings>,
    }

    export interface IPluginFeatureBase{
        /** Activate this feature */
        enabled: boolean
        /** Id of this feature */
        id?: string,
        /** title of  this feature */
        title?: string;
    }
    export interface IPluginFeature<T> extends IPluginFeatureBase {
        /** Setting name that's used by REST api to persit settings */
        settingName: string,
        /** Default settings when nothing has bee save yet*/
        defaultSettings?: T,
        /** Help describing this feature*/
        help?: string,
        /** URL describing this feature */
        helpUrl?:string
    }

    export interface IPluginFeatureField extends IPluginFeatureBase {
        /**  Field type id that will be use when rendering the data */
        fieldType: string,
        /**  default field Parameters*/
        defaultParameters: IPluginUi_plugin_set_labels_on_saveFieldParameter,
        /**  description of  field  capabilities*/
        fieldConfigOptions: IFieldDescription,
        /**  Default value when none is present */
        defaultValue:unknown,
    }

    export interface IPluginFeatureDashboard extends IPluginFeatureBase {
        /** Icon of the dashboard (See font awesome) */
        icon: string,
        /** Parent of the dashboard (It should exists)) */
        parent: string
        /** Whether using filter when searching.*/
        usefilter: boolean,
        /** Order in the tree */
        order:number,
    }





    export interface IPluginSettingPage<T> {
        renderSettingPage?: () => void,
        showAdvanced?: () => void,
        showSimple?: () => void,
        getSettingsDOM?: (_setting?:T) => JQuery,
        settings?: T,
        saveAsync?: () => JQueryDeferred<unknown>,
        paramChanged?:()=>void,
        settingsOriginal?: T,
        settingsChanged?:T,
        getProject?: () => string,
        pageId?:string,
        initPage?: (_title: string, _showAdvancedBtn: boolean, _showDeleteText: string, _help: string, _externalHelp?: string, _showCopy?: boolean) => void
        showAdvancedCode?:(_code:string, _success:(_code:string) => void, _semanticValidate?:IValidationSpec) =>void
  
     }


    export abstract class PluginCore implements IPlugin {

      
        /* DON'T CHANGE ANYTHING BELOW UNLESS YOU KNOW WHAT YOU ARE DOING */

        /** if false the plugin will not be loaded (for debugging) */
        public isDefault = true;

        /** can be overwritten by plugin to enable or disable functionality based on what is selected/configured */
        protected enabledInContext = true;


        constructor() {
            console.debug(`Constructing ${Plugin.PLUGIN_NAME}`);
        }

        // ------------------------------------------------ initialization calls  ------------------------------------------------    

        initProject(project:string) {
            this.onInitProject(project);
        }
        // to be overwritten
        abstract onInitProject(project:string); 
        

        initItem(_item: IItem, _jui: JQuery) {
            
            this.onInitItem(_item);
        }
        // to be overwritten
        abstract onInitItem(_item: IItem);


        // ------------------------------------------------ item menu ------------------------------------------------

        protected enableToolMenu(ul: JQuery, _hook: number) {
            return this.enabledInContext;
        }
        
        // by default plugins add none or one item to the tool menu of displayed items. This class can be overwritten if needed
        updateMenu(ul: JQuery, hook: number) {

            if (Plugin.config.menuToolItem.enabled && this.enableToolMenu(ul,hook)) {
                const li = $(`<li><a>${Plugin.config.menuToolItem.title}</a></li>`).on("click", () => {
                    const m = new Tool();
                    m.menuClicked(app.getCurrentItemId());
                });
                ul.append(li);
          }  
        }

        // ------------------------------------------------ control (fields) implementation ------------------------------------------------
        
        protected enableControl(fieldType:string) {
            return this.enabledInContext;
        }

        // this method is called to see if a plugin defines or overwrites a field type
        supportsControl(fieldType: string): boolean {
            return this.enableControl(fieldType) &&  fieldType == Plugin.config.field.fieldType && Plugin.config.field.enabled;
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

     

        // ------------------------------------------------ project setting page ------------------------------------------------
        protected enableProjectSetting() {
            return this.enabledInContext;
        }
        getProjectSettingPages(): ISettingPage[] {
            const pbpi = ProjectSettingsPage();
            if (!this.enableProjectSetting() || !Plugin.config.projectSettingsPage.enabled) {
                return [];
            } else { 
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
        }
        

        // ------------------------------------------------ server settings page  ------------------------------------------------
       
        protected enableServerSetting() {
            return this.enabledInContext;
        }

        getCustomerSettingPages(): ISettingPage[] {
            const pbpi = ServerSettingsPage();
            if (!this.enableServerSetting() || !Plugin.config.customerSettingsPage.enabled) {
                return [];
            } else {
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
        }

         // ------------------------------------------------ project dashboard / or folder dashboard  ------------------------------------------------
       
         protected enableDashboard() {
            return this.enabledInContext;
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


        // ------------------------------------------------ plugin description (used by CI) ------------------------------------------------
        
        
        static PLUGIN_NAME = "<PLUGIN_NAME_PLACEHOLDER>";
        static PLUGIN_VERSION = "<PLUGIN_VERSION_PLACEHOLDER>";

        getPluginName() {
            return Plugin.PLUGIN_NAME;
        }

        getPluginVersion() {
            return Plugin.PLUGIN_VERSION;
        }

    }
}