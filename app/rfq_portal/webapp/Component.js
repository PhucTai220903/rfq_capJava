sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "rfqportal/model/models",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/json/JSONModel",
  ],
  (UIComponent, models, ODataModel, JSONModel) => {
    "use strict";

    return UIComponent.extend("rfqportal.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      init() {
        UIComponent.prototype.init.apply(this, arguments);

        this.setModel(models.createDeviceModel(), "device");

        this._initializeModelBasedOnRole();

        this.getRouter().initialize();

        sap.ui.component.load({
          name: "rfqportal.admin",
          manifest: "json",
          async: true,
        });

        sap.ui.component.load({
          name: "rfqportal.buyer",
          manifest: "json",
          async: true,
        });

        sap.ui.component.load({
          name: "rfqportal.vendor",
          manifest: "json",
          async: true,
        });
      },

      _initializeModelBasedOnRole: function () {
        var that = this;

        jQuery.ajax({
          url: "/odata/v4/reference/getUserRoles",
          method: "GET",
          success: function (data) {
            var aRoles = data.value || [];
            var sRole = null;

            if (aRoles.includes("ADMIN")) {
              sRole = "admin";
            } else if (aRoles.includes("BUYER")) {
              sRole = "buyer";
            } else if (aRoles.includes("VENDOR")) {
              sRole = "vendor";
            }

            if (sRole) {
              that._createAndSetModel(sRole);
            } else {
              console.warn("No valid role found for user");
            }
          },
          error: function (xhr) {
            console.error("Failed to get user roles:", xhr);
          },
        });
      },

      _createAndSetModel: function (sRole) {
        var mDataSources = this.getManifestEntry("/sap.app/dataSources");
        var sServiceKey = sRole + "Service";

        if (mDataSources[sServiceKey]) {
          var oModel = new ODataModel({
            serviceUrl: mDataSources[sServiceKey].uri,
            synchronizationMode: "None",
            operationMode: "Server",
            autoExpandSelect: true,
            earlyRequests: true,
          });

          this.setModel(oModel);

          this.setModel(
            new JSONModel({
              currentRole: sRole,
              serviceUrl: mDataSources[sServiceKey].uri,
              timestamp: new Date().toISOString(),
            }),
            "appConfig"
          );
        } else {
          console.error("DataSource not found for role:", sRole);
        }
      },
    });
  }
);
