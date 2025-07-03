sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("rfqportal.controller.NotImplemented", {
      onInit() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteNotImplemented")
          .attachMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var sModule = oEvent.getParameter("arguments").module;
        var sModuleTitle = this._getModuleTitle(sModule);

        var oModel = new JSONModel({
          moduleTitle: sModuleTitle,
          message: sModuleTitle + " module - To be implemented",
        });

        this.getView().setModel(oModel);
      },

      _getModuleTitle: function (sKey) {
        var mModules = {
          "purchase-order": "Purchase Order",
          contract: "Contract Management",
          vendor: "Vendor Management",
          inventory: "Inventory Management",
          reporting: "Reporting & Analytics",
          account: "Account Settings",
        };

        return mModules[sKey] || "Unknown Module";
      },
    });
  }
);
