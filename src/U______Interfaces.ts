/* Setting interfaces */
// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {


    export interface IControlOptions extends IBaseControlOptions{
        placeholder:string
    }

    export interface IServerSettings {
        /** Server Setting placeholder */
        content: string;
    }
    export interface IPluginUi_plugin_set_labels_on_saveFieldParameter extends IFieldParameter {
        /** field parameter placeholder*/
        fieldParameter: string;
    }
    export interface IProjectSettings {
        /** Setting for project placeholder */
        content: string;
    }

    // DO NOT MODIFY BELOW un

   
    /** Description of the current plugin. Each feature can be activated/desactivated using the configuration object */
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
  
}
