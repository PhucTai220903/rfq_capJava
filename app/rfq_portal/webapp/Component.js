sap.ui.define([
    "sap/ui/core/UIComponent",
    "rfqportal/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("rfqportal.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            UIComponent.prototype.init.apply(this, arguments);

            this.setModel(models.createDeviceModel(), "device");

            this.getRouter().initialize();
        }
    });
});