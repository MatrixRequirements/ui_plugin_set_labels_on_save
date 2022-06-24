/// <reference path="./api/Matrix.Labels.ts" />
/// <reference path="./api/PlugInCore.ts" />

// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {
    
    export class Plugin extends PluginCore {

        // Define the plugin configuration in the following object. See interface comments for explanation

        static pluginDisplayName = "Set Labels on Save";

        static config: IPluginConfig = {
            customerSettingsPage: {
                id: "U______projectsettings",
                title: "U_____ projectsettings page",
                enabled: false,
                defaultSettings: {
                    myServerSetting: "boiler plate",
                },
                settingName: "U______settings",
                help: "This is my help text",
                helpUrl:"https://docs23.matrixreq.com"
            },
            projectSettingsPage: {
                id: "ProjectSettingSetLabelOnSave",
                title:Plugin.pluginDisplayName,
                enabled: true,
                defaultSettings: {
                    dirtyLabel: "",
                },
                settingName: "SetLabelOnSave",
                help: "This is my help text",
                helpUrl:"https://docs23.matrixreq.com"
            },
            menuToolItem: {
                enabled: true,
                title:"ui_plugin_set_labels_on_save-menuitem",
            },
            field: {
                enabled: true,
                fieldType: "ui_plugin_set_labels_on_save",
                defaultValue: "Default value",
                title: "ui_plugin_set_labels_on_save-field",
                fieldConfigOptions: {
                    id: "ui_plugin_set_labels_on_save",
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
                    label: "ui_plugin_set_labels_on_save-field",
                },
                defaultParameters: {
                    myParameter: "ui_plugin_set_labels_on_save-field",
                }
            },
            dashboard: {        
                
                id:"U_____",
                title: "U_____ dashboard page",
                enabled: true,
                icon: "fal fa-cog",
                parent: "DASHBOARDS",
                usefilter: true,
                order: 9999,
            }
        };

        /**
         * the constructor is loaded once after all the source code is loaded by the browser. Nothing is known about the instance, project, user etc.
         * You can use it to initialize things like callbacks after item changes
         */
        constructor() {
            super();
            // ---------- my own code  ------
            let that = this; // eslint-disable-line
            
            MR1.onAfterSave().subscribe( <any>this, function (event:IItemChangeEvent) { // eslint-disable-line
        
                return that.onAfterSave( event );
            });
            // ---------- my own code  ------
        }

        /**
         * This method is called after a project has been selected/initialized. 
         * At the time it is called, all project settings, categories etc are defined.
         * 
         * @param project // id of the loaded project
         */
        onInitProject(project:string) {
            const that = this;
    
            const psp = ProjectSettingsPage();
            if (!psp.settings.dirtyLabel) {
                that.enabledInContext = false;
            }
            else if( new LabelTools().getLabelNames().indexOf( psp.settings.dirtyLabel )==-1 ) {
                that.enabledInContext = false;
                console.log(`${Plugin.pluginDisplayName} Label "${psp.settings.dirtyLabel}" is not defined`);
            } else {
                that.enabledInContext = true;
            }
        }

        /** this method is called just before the rendering of an item is done
        * It is also called when opening the create item dialog.
        * 
        * @param _item: the item which is being loaded in the UI 
        */
        onInitItem(item: IItem) {
            // add your code here
        }


        // ---------- my own code  ------ 
        private onAfterSave( event:IItemChangeEvent ) {
            const that = this;// eslint-disable-line
    
            //if (that.projectSettings) {
                console.log( event )
            //}
        }
    }
}

// Register the plugin
$(function () {
    plugins.register(new Ui_plugin_set_labels_on_save.Plugin());
});
