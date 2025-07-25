sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("rfqportal.controller.BaseController", {
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      getInitials: function (sName) {
        if (!sName) return "";
        const aWords = sName.split(" ");
        return aWords
          .map((word) => word.charAt(0))
          .join("")
          .substr(0, 2)
          .toUpperCase();
      },

      onNavBack: function () {
        var oRouter = this.getRouter();
        oRouter.navTo("RouteDashboard");
      },
    });
  }
);
