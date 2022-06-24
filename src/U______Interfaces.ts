/* Setting interfaces */
// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {


    /** server setting for plugin */
    export interface IServerSettings {
        /** Server Setting example */
        myServerSetting: string;
    }

    /** options for user to configure a control (field) inside a project category */
    export interface IPluginUi_plugin_set_labels_on_saveFieldParameter extends IFieldParameter {
        /** example field parameter */
        myParameter: string;
    }

    /** project setting used to configure plugin  */
    export interface IProjectSettings {
        /** set that label to activate the plugin */
        dirtyLabel:string; 
    }
  
}
