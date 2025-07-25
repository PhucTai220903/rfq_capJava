sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend(
      "rfqportal.components.buyer.controller.CreateRFQ",
      {
        onInit: function () {
          var oModel = new JSONModel({
            Title: "",
            Description: "",
            DueDate: "",
            BusinessDomain: "",
          });

          this.getView().setModel(oModel);
        },

        onNavBack: function () {
          this.getOwnerComponent().getRouter().navTo("BuyerMain");
        },

        onSubmitRFQ: function () {
          var oModel = this.getView().getModel();
          var oData = oModel.getData();

          MessageToast.show("RFQ submitted successfully!");
        },
      }
    );
  }
);
