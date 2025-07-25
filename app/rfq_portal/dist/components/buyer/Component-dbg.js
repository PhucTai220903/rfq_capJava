sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
  ],
  (UIComponent, JSONModel, ODataModel) => {
    "use strict";

    return UIComponent.extend("rfqportal.components.buyer.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        this._initializeBuyerModel();

        this.getRouter().initialize();
      },

      _initializeBuyerModel: function () {
        var mDataSources = this.getManifestEntry("/sap.app/dataSources");

        if (mDataSources && mDataSources.buyerService) {
          var oModel = new ODataModel({
            serviceUrl: mDataSources.buyerService.uri,
            synchronizationMode: "None",
            operationMode: "Server",
            autoExpandSelect: true,
            earlyRequests: true,
          });

          this.setModel(oModel);

          this.setModel(
            new JSONModel({
              currentRole: "buyer",
              serviceUrl: mDataSources.buyerService.uri,
              timestamp: new Date().toISOString(),
            }),
            "appConfig"
          );
        } else {
          console.error("Buyer DataSource not found in manifest");

          // Tạo appConfig model mặc định nếu không có DataSource
          this.setModel(
            new JSONModel({
              currentRole: "buyer",
              serviceUrl: "/odata/v4/buyer/",
              timestamp: new Date().toISOString(),
            }),
            "appConfig"
          );
        }
      },
    });
  }
);
