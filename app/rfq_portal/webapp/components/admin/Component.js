sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  (UIComponent, JSONModel) => {
    "use strict";

    return UIComponent.extend("rfqportal.components.admin.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        // ✅ Models sẽ được auto-propagate từ parent component
        // Không cần tạo model manual
        console.log("Admin component initialized with models:", {
          defaultModel: !!this.getModel(),
          appConfig: !!this.getModel("appConfig"),
          device: !!this.getModel("device"),
          i18n: !!this.getModel("i18n"),
        });

        this.getRouter().initialize();
      },
    });
  }
);
