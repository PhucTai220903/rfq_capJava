sap.ui.define(
  [
    "rfqportal/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("rfqportal.controller.Contract", {
      onInit: function () {
        // Initialize contract model
        this._initializeContractModel();
      },

      _initializeContractModel: function () {
        var oContractData = {
          ID: "",
          title: "",
          description: "",
          status: "A",
        };

        var oModel = new JSONModel(oContractData);
        this.getView().setModel(oModel, "contract");
      },

      onSave: function () {
        var oModel = this.getView().getModel("contract");
        var oData = oModel.getData();

        // Basic validation
        if (!oData.ID || !oData.title) {
          MessageBox.error("Please fill in Contract ID and Title");
          return;
        }

        // Simulate save operation
        MessageToast.show("Contract saved successfully");

        // Clear form after save
        this._clearForm();
      },

      onCancel: function () {
        MessageBox.confirm(
          "Are you sure you want to cancel? All changes will be lost.",
          {
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.OK) {
                this._clearForm();
                MessageToast.show("Changes cancelled");
              }
            }.bind(this),
          }
        );
      },

      onDelete: function () {
        var oModel = this.getView().getModel("contract");
        var oData = oModel.getData();

        if (!oData.ID) {
          MessageBox.error("No contract selected for deletion");
          return;
        }

        MessageBox.confirm("Are you sure you want to delete this contract?", {
          title: "Confirm Deletion",
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              this._clearForm();
              MessageToast.show("Contract deleted successfully");
            }
          }.bind(this),
        });
      },

      _clearForm: function () {
        var oModel = this.getView().getModel("contract");
        oModel.setData({
          ID: "",
          title: "",
          description: "",
          status: "A",
        });
      },
    });
  }
);
