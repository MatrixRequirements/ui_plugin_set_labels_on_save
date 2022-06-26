/// <reference path="./api/Matrix.Labels.ts" />
/// <reference path="./api/PlugInCore.ts" />

// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {
    
    export class Plugin extends PluginCore {

        // Define the plugin configuration in the following object. See interface comments for explanation

        static pluginDisplayName = "Set Labels on Save";
        protected projectSettings:IProjectSettings;
        protected categories:string[];

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
                enabled: false,
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
                enabled: false,
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
    
            this.projectSettings = <IProjectSettings>IC.getSettingJSON( Plugin.config.projectSettingsPage.settingName, Plugin.config.projectSettingsPage.defaultSettings );

            if (!this.projectSettings.dirtyLabel) {
                that.enabledInContext = false;
            }
            else if( new LabelTools().getLabelNames().indexOf(this.projectSettings.dirtyLabel )==-1 ) {
                that.enabledInContext = false;
                console.log(`${Plugin.pluginDisplayName} Label "${this.projectSettings.dirtyLabel}" is not defined`);
            } else {
                this.categories = new LabelTools().getLabelDefinitions(null).filter( label => label.label == "dirty")[0].categories;
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
            const that = this;
    
            console.log( event );
            const after = event.after.labels?event.after.labels.split(","):[];

            if (after.indexOf(this.projectSettings.dirtyLabel) == -1 &&
                event.before.labels.indexOf(this.projectSettings.dirtyLabel) != -1) {
                    // dirty label was toggled off
                    let contentChanged = false;

                    // check if some other relevant changes happened
                    if (event.after.title != event.before.title) {
                        contentChanged = true;
                    }
                    let fieldIs = IC.getFields(event.after.id).map( field => field.id);
                    for (let field of fieldIs) {
                        if (!event.before[field] && !event.after[field]) {
                            // all good (both are not initialized/empty)
                        } else if (!event.before[field]) {
                            contentChanged = true;
                        } else if (!event.after[field]) {
                            contentChanged = true;
                        } else if (event.before[field]  != event.after[field]) {
                            contentChanged = true;
                        }
                    }

                    if (!contentChanged) {
                        // only labels were changed (and the dirty was unset)
                        return;
                    }
                        
                }

            if (that.enabledInContext) {
                // get all downlinks which have the dirty label defined
                let downs = matrixApplicationUI.currentItem.downLinks.map( down => down.to).filter( down => that.categories.indexOf( ml.Item.parseRef(down).type) != -1);
                that.setDirty( downs );
            }
        }

        private async setDirty( itemIds:string[] ) {
            for (let itemId of itemIds) {
                await this.setDirtyLabel(  itemId );
            }
        }
        private async setDirtyLabel( itemId:string ) {
            let res = $.Deferred();
            
            let update = {id:itemId , onlyThoseFields:1,onlyThoseLabels:1, labels:this.projectSettings.dirtyLabel};
           
            app.updateItemInDBAsync(update, "dirty (parent change)" ).always( () => {
                res.resolve();
            });
            return res;
        }
        
    }
}

// Register the plugin
$(function () {
    plugins.register(new Ui_plugin_set_labels_on_save.Plugin());
});
