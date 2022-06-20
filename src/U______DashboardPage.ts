// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_set_labels_on_save {
    export class DashboardPage {
        settings: IProjectSettings;

        constructor() {
            this.settings = { ...Plugin.config.projectSettingsPage.defaultSettings, ...IC.getSettingJSON(Plugin.config.projectSettingsPage.settingName, {}) } ;
        }

        /** Customize static HTML here */
        private getDashboardDOM(): JQuery {
            return $(`
        <div class="panel-body-v-scroll fillHeight"> 
            <div class="panel-body">
                This is my content : ${this.settings.dirtyLabel}
            </div>
        </div>
        `);
        }

        /** Add interactive element in this function */
        renderProjectPage() {

            const control = this.getDashboardDOM();
            app.itemForm.append(
                ml.UI.getPageTitle(
                    this.settings.dirtyLabel,
                    () => {
                        return control;
                    },
                    () => {
                        this.onResize();
                    }
                )
            );
            app.itemForm.append(control);
        }

        onResize() {
           /* Will be triggered when resizing. */
        }
    }
}
