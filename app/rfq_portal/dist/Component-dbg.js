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
      },

      _initializeModelBasedOnRole: function () {
        var that = this;

        jQuery.ajax({
          url: "odata/v4/reference/getUserRoles",
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
              that._validateRouteAccess(sRole);
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

          // ✅ Lưu reference để propagate cho child components
          this._currentRole = sRole;
          this._oDataModel = oModel;
        } else {
          console.error("DataSource not found for role:", sRole);

          this.setModel(
            new JSONModel({
              currentRole: sRole,
              serviceUrl: "/odata/v4/" + sRole + "/",
              timestamp: new Date().toISOString(),
            }),
            "appConfig"
          );
        }
      },

      // ✅ Override createComponent để auto-propagate models
      createComponent: function (vUsage, sId, mSettings) {
        var oComponentPromise = UIComponent.prototype.createComponent.apply(
          this,
          arguments
        );

        var that = this;
        return oComponentPromise.then(function (oComponent) {
          // Auto-propagate models to child component
          that._propagateModelsToChild(oComponent);
          return oComponent;
        });
      },

      _propagateModelsToChild: function (oChildComponent) {
        if (!oChildComponent) {
          return;
        }

        console.log(
          "Auto-propagating models to child component:",
          oChildComponent.getId()
        );

        // Propagate default OData model
        var oMainModel = this.getModel();
        if (oMainModel && !oChildComponent.getModel()) {
          oChildComponent.setModel(oMainModel);
          console.log("Propagated default model to child");
        }

        // Propagate appConfig model
        var oAppConfigModel = this.getModel("appConfig");
        if (oAppConfigModel && !oChildComponent.getModel("appConfig")) {
          oChildComponent.setModel(oAppConfigModel, "appConfig");
          console.log("Propagated appConfig model to child");
        }

        // Propagate device model
        var oDeviceModel = this.getModel("device");
        if (oDeviceModel && !oChildComponent.getModel("device")) {
          oChildComponent.setModel(oDeviceModel, "device");
          console.log("Propagated device model to child");
        }

        // Propagate i18n model
        var oI18nModel = this.getModel("i18n");
        if (oI18nModel && !oChildComponent.getModel("i18n")) {
          oChildComponent.setModel(oI18nModel, "i18n");
          console.log("Propagated i18n model to child");
        }
      },

      _validateRouteAccess: function (sRole) {
        if (!sRole) {
          console.error("No valid role found");
        }
      },
    });
  }
);
