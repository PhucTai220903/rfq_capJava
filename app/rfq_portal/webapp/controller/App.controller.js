sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel",
  ],
  function (Controller, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("rfqportal.controller.App", {
      onInit: function () {},

      onGoToApplication: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        var that = this;

        jQuery.ajax({
          url: "/odata/v4/admin/getUserRoles",
          method: "GET",
          success: function (data) {
            var aRoles = data.value || [];

            if (aRoles.includes("ADMIN")) {
              that._createAndSetModel("admin");
              oRouter.navTo("RouteAppAdmin");
            } else if (aRoles.includes("BUYER")) {
              that._createAndSetModel("buyer");
              oRouter.navTo("RouteAppBuyer");
            } else if (aRoles.includes("VENDOR")) {
              that._createAndSetModel("vendor");
              oRouter.navTo("RouteAppVendor");
            } else {
              MessageToast.show("Bạn không có quyền truy cập.");
            }
          },
          error: function () {
            MessageToast.show("Không thể kiểm tra quyền truy cập.");
          },
        });
      },

      _createAndSetModel: function (sRole) {
        var oComponent = this.getOwnerComponent();
        var mDataSources = oComponent.getManifestEntry("/sap.app/dataSources");
        var sServiceKey = sRole + "Service";

        if (mDataSources[sServiceKey]) {
          var oModel = new ODataModel({
            serviceUrl: mDataSources[sServiceKey].uri,
            synchronizationMode: "None",
            operationMode: "Server",
            autoExpandSelect: true,
            earlyRequests: true,
          });

          // Set làm default model
          oComponent.setModel(oModel);

          // Store current role for later use
          oComponent.setModel(
            new sap.ui.model.json.JSONModel({
              currentRole: sRole,
              serviceUrl: mDataSources[sServiceKey].uri,
            }),
            "appConfig"
          );
        }
      },
    });
  }
);
